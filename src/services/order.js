import { ID, Permission, Query, Role } from "appwrite";
import { databaseID, databases } from "./config";
import { date2TimeAgo } from "../commun/utils/time_formats";
import { getUser } from "./auth";

async function getOrders({currentPage, pageSize}) {
    const offset = (currentPage - 1) * pageSize
    const data = await databases.listDocuments(
        databaseID,
        'orders',
        [
            Query.limit(pageSize),
            Query.offset(offset),
            Query.notEqual('status', 'in_card'),
            Query.orderDesc('$createdAt'),
        ],
    )

    const orders = data.documents.map((order) => {
        const orderItemsPrices = order.orderItems.map((item) => {
            return item.product.price
        })

        const itemsPrice = orderItemsPrices.flat().reduce((sum, price) => sum + price, 0);
        
        const price = itemsPrice + order.delivery_price.price

        console.log(order.orderItems);
        
        
        if (!order.orderItems || order.orderItems.length === 0) {
            return null
        }

        return {
            id: order.$id,
            timeAgo: date2TimeAgo(order.$createdAt),
            status: order.status,
            price: price,
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

async function getOrder({id}) {
    let order = null
    if (id) {
        order = await databases.getDocument(
            databaseID,
            'orders',
            id,
        )
    } else {
        const orders = await databases.listDocuments(
            databaseID,
            'orders',
            [
                Query.equal('status', 'in_card'),
                Query.limit(1),
            ],
        )

        if (orders.documents.length > 0) {
            order = orders.documents[0]
        }
    }

    if (!order) {
        return null
    }

    const orderItems = await Promise.all(
        order.orderItems.map(async (item) => {
            const orderItem = await databases.getDocument(
                databaseID,
                'order_items',
                item.$id,
            );
            return orderItem;
        })
    );

    order.items = orderItems

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

async function makeOrder({address, price_id, cardID, name, phone}) {
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
    const card = await databases.listDocuments(
        databaseID,
        'orders',
        [
            Query.equal('status', 'in_card'),
            Query.limit(1),
        ],
    );

    let order = null;

    const currentUser = await getUser();

    if (card.documents.length === 0) {
        const orderItem = await databases.createDocument(
            databaseID,
            'order_items',
            ID.unique(),
            {
                product: productID,
                size: sizeID,
                color: colorID,
                product_count: quantity,
            },
            [
                Permission.write(Role.user(currentUser.$id)),
            ]
        )

        order = await databases.createDocument(
            databaseID,
            'orders',
            ID.unique(),
            {
                status: 'in_card',
                client: currentUser.$id,
                orderItems: [
                    orderItem.$id
                ],
            },
            [
                Permission.write(Role.user(currentUser.$id)),
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
        );
    } else {
        const orderItem = await databases.createDocument(
            databaseID,
            'order_items',
            ID.unique(),
            {
                product: productID,
                size: sizeID,
                color: colorID,
                product_count: quantity,
            },
            [
                Permission.write(Role.user(currentUser.$id)),
            ]
        );

        const orderItemIDs = order.orderItems.map((item) => item.$id);

        orderItemIDs.push(orderItem.$id);
        

        await databases.updateDocument(
            databaseID,
            'orders',
            order.$id,
            {
                orderItems: orderItemIDs,
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

export { getOrders, getOrder, makeOrder, deleteOrder, addItemToCard, removeItemFromCard, getOrderFormData };