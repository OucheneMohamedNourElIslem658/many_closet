import { ID, Permission, Query, Role } from "appwrite";
import { databaseID, databases, fileStorage } from "./config";
import { date2TimeAgo } from "../commun/utils/time_formats";
import { getUser } from "./auth";

async function getOrders({currentPage, pageSize, status, id, isAdmin}) {
    const offset = (currentPage - 1) * pageSize
    const queries = [
        Query.limit(pageSize),
        Query.offset(offset),
        Query.notEqual('status', 'in_card'),
        Query.orderDesc('$createdAt'),
    ]

    const currentUser = await getUser()

    if (isAdmin) {
        const isCurrentUserAdmin = currentUser?.labels?.some((role) => role === 'admin')
        if (!isCurrentUserAdmin) {
            throw new Error('You are not authorized to view this page')
        }
    } else {
        queries.push(Query.equal('client', currentUser.$id))
    }

    if (id) {
        queries.push(Query.startsWith('$id', id))
    }

    if (status && status !== 'All') {
        queries.push(Query.equal('status', status))
    }

    const data = await databases.listDocuments(
        databaseID,
        'orders',
        queries
    )

    const orders = data.documents.map((order) => {
        const orderItemsPrices = order.orderItems.map((item) => {
            return item.product.price
        })

        const itemsPrice = orderItemsPrices.flat().reduce((sum, price) => sum + price, 0);
        
        const price = itemsPrice + order.delivery_price.price
        
        
        if (!order.orderItems || order.orderItems.length === 0) {
            return null
        }

        return {
            id: order.$id,
            timeAgo: date2TimeAgo(order.$createdAt),
            status: order.status,
            price: price,
            state: order.delivery_price.state,
            items: order.orderItems.map((item) => {
            return {
                name: item.product.name,
                quantity: item.quantity,
                color: item.color ? item.color.name : null,
                size: item.size ? item.size.name : null,
            }})
        }
    })

    const maxPages = Math.ceil(data.total / pageSize)

    return {
        orders: orders.filter((order) => order !== null),
        maxPages: maxPages
    }
}

async function getOrdersPrices({currentPage, pageSize}) {
    const currentUser = await getUser()
    const isCurrentUserAdmin = currentUser?.labels?.some((role) => role === 'admin')
    if (!isCurrentUserAdmin) {
        throw new Error('You are not authorized to view this page')
    }

    const offset = (currentPage - 1) * pageSize

    const data = await databases.listDocuments(
        databaseID,
        'delivery_prices',
        [
            Query.limit(pageSize),
            Query.offset(offset),
            Query.orderDesc('$createdAt'),
        ]
    )

    const prices = data.documents.map((price) => {
        return {
            id: price.$id,
            state: price.state,
            price: price.price,
        }
    })

    const maxPages = Math.ceil(data.total / pageSize)

    return {
        prices: prices,
        maxPages: maxPages
    }
}

async function getOrder({id}) {
    let order = null
    if (id) {
        order = await databases.getDocument(
            databaseID,
            'orders',
            id,
        )
    } else {
        const currentUser = await getUser()

        const orders = await databases.listDocuments(
            databaseID,
            'orders',
            [
                Query.equal('status', 'in_card'),
                Query.limit(1),
                Query.equal('client', currentUser.$id),
            ],
        )

        if (orders.documents.length > 0) {
            order = orders.documents[0]
        }
    }

    if (!order) {
        return null
    }

    const orderItemsIDs = order.orderItems.map((item) => item.$id)

    const orderItems = (await databases.listDocuments(
        databaseID,
        'order_items',
        [
            Query.equal('$id', orderItemsIDs),
            Query.limit(100),
            Query.orderDesc('$updatedAt'),
        ],
    )).documents

    const orderItemsPrices = order.orderItems.map((item) => {
        return item.product.price
    })

    const isMyCard = order.status === 'in_card'

    const itemsPrice = orderItemsPrices.reduce((sum, price) => sum + price, 0);
    const price = !isMyCard ? (itemsPrice + order.delivery_price.price) : null

    const shippmentPrice = !isMyCard ? order.delivery_price.price : null

    const deliveryAddress = !isMyCard ? `${order.delivery_price.state} - ${order.address}` : null

    return {
        id: order.$id,
        price: price,
        timeAgo: date2TimeAgo(order.$createdAt),
        status: order.status,
        address: deliveryAddress,
        shippment_price: shippmentPrice,
        itemsPrice: itemsPrice,
        receipt: order.receipt,
        items: orderItems.map((item) => {
            return {
                id: item.$id,
                name: item.product.name,
                quantity: item.product_count,
                color: item.color.name,
                size: item.size.name,
                picURL: item.product.images?.[0]?.url || null,
                price: item.product.price * item.product_count,
            }
        })
    }
}

async function getOrderFormData() {
    const data = await Promise.all([
        getUser(),
        databases.listDocuments(
            databaseID,
            'delivery_prices',
            [
                Query.limit(100),
            ],
        ),
    ])

    return {
        user: data[0],
        deliveryPrices: data[1].documents.map((price) => {
            return {
                id: price.$id,
                state: price.state,
                price: price.price,
            }
        })
    }
}

async function makeOrder({address, price_id, cardID, name, phone, image}) {
    const file = await fileStorage.createFile(
        'shop',
        ID.unique(),
        image,
    )

    const previewURL = await fileStorage.getFilePreview(
        'shop',
        file.$id,
    )

    const storedImage = await databases.createDocument(
        databaseID,
        'images',
        ID.unique(),
        {
            url: previewURL,
            storage_id: file.$id,
        },
    )

    await databases.updateDocument(
        databaseID,
        'orders',
        cardID,
        {
            address: address,
            delivery_price: price_id,
            status: 'pending',
            name: name,
            phone_number: Number(phone),
            receipt: storedImage.$id,
        },
    )
}

async function deleteOrder(id) {
    const order = await databases.getDocument(
        databaseID,
        'orders',
        id,
    )

    if (order.status !== 'pending') {
        throw new Error('You can only delete pending orders')
    }
    
    await databases.deleteDocument(
        databaseID,
        'orders',
        id,
    )
}

async function addItemToCard({productID, sizeID, colorID, quantity}) {
    const currentUser = await getUser();

    const card = await databases.listDocuments(
        databaseID,
        'orders',
        [
            Query.equal('status', 'in_card'),
            Query.limit(1),
            Query.equal('client', currentUser.$id),
        ],
    );

    let order = null;

    if (card.documents.length === 0) {
        order = await databases.createDocument(
            databaseID,
            'orders',
            ID.unique(),
            {
                status: 'in_card',
                client: {
                    $id: currentUser.$id,
                    name: currentUser.name,
                    email: currentUser.email
                },
                orderItems: [
                    {
                        product: productID,
                        size: sizeID,
                        color: colorID,
                        product_count: quantity,
                    }
                ],
            },
            [
                Permission.write(Role.user(currentUser.$id)),
                Permission.read(Role.user(currentUser.$id)),
            ]
        );

        return;
    }

    order = card.documents[0];

    let existingItem = order.orderItems.find(
        (item) => item.product.$id === productID && item.size.$id === sizeID && item.color.$id === colorID
    );

    if (existingItem) {
        const newQuantity = existingItem.product_count + quantity;
        
        await databases.updateDocument(
            databaseID,
            'order_items',
            existingItem.$id,
            {
                product_count: newQuantity,
            },
            null
        );
    } else {
        const oldOrderItems = order.orderItems.map((item) => {
            return {
                $id: item.$id,
                product: item.product.$id,
                size: item.size.$id,
                color: item.color.$id,
                product_count: item.product_count,
            }
        })

        await databases.updateDocument(
            databaseID,
            'orders',
            order.$id,
            {
                orderItems: [
                    ...oldOrderItems,
                    {
                        product: productID,
                        size: sizeID,
                        color: colorID,
                        product_count: quantity,
                    }
                ],
            },
        );
    }
}

async function removeItemFromCard(id) {
    await databases.deleteDocument(
        databaseID,
        'order_items',
        id,
    )
}

async function updateOrder({id, status}) {
    if (status && status !== 'in_card') {
        const docs = await databases.listDocuments(
            databaseID,
            'orders',
            [
                Query.equal('$id', id),
                Query.limit(1),
            ],
        )

        if (docs.documents.length > 0) {
            
            await databases.updateDocument(
                databaseID,
                'orders',
                docs.documents[0].$id,
                {
                    status: status,
                }
            )
        }

    }
}

const editDeliveryPrice = async ({ id, newState, newPrice }) => {
    const newDeliveryPrice = {};

    if (newState) {
        newDeliveryPrice.state = newState;
    }

    if (newPrice) {
        newDeliveryPrice.price = newPrice;
    }

    await databases.updateDocument(
        databaseID,
        'delivery_prices',
        id,
        {
            state: newState,
            price: newPrice
        }
    )
};

const createDeliveryPrice = async ({ state, price }) => {
    const newDeliveryPrice = {
        state: state,
        price: price
    };

    await databases.createDocument(
        databaseID,
        'delivery_prices',
        ID.unique(),
        newDeliveryPrice,
    )
};

export { getOrders, getOrder, makeOrder, deleteOrder, addItemToCard, removeItemFromCard, getOrderFormData, updateOrder, getOrdersPrices, editDeliveryPrice, createDeliveryPrice };