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
            Query.notEqual('status', 'in_card')
        ],
    )

    const orderItemsPrices = data.documents.map((order) => {
        return order.orderItems.map((item) => {
            return item.product.price
        })
    })

    const itemsPrice = orderItemsPrices.flat().reduce((sum, price) => sum + price, 0);

    const orders = data.documents.map((order) => {
        const price = itemsPrice + order.delivery_price.price
        
        return {
            id: order.$id,
            timeAgo: date2TimeAgo(order.$createdAt),
            status: order.status,
            price: price,
            items: order.orderItems.map((item) => {
                return {
                    name: item.product.name,
                    quantity: item.quantity,
                    color: item.color.name,
                    size: item.size.name,
                }
            })
        }
    })

    const maxPages = Math.ceil(data.total / pageSize)

    return {
        orders: orders,
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

    const itemsPrice = orderItemsPrices.reduce((sum, price) => sum + price, 0);
    const price = itemsPrice + order.delivery_price.price

    return {
        id: order.$id,
        price: price,
        timeAgo: date2TimeAgo(order.$createdAt),
        status: order.status,
        address: `${order.delivery_price.state} - ${order.address}`,
        shippment_price: order.delivery_price.price,
        itemsPrice: itemsPrice,
        items: orderItems.map((item) => {
            return {
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

async function makeOrder({address, price_id, cardID, name, phone}) {
    await databases.updateDocument(
        databaseID,
        'orders',
        cardID,
        {
            address: address,
            delivery_price: { $id: price_id },
            status: 'pending',
            name: name,
            phone_number: phone,
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

    if (card.documents.length === 0) {
        const currentUser = await getUser();

        order = await databases.createDocument(
            databaseID,
            'orders',
            ID.unique(),
            {
                status: 'in_card',
                client: { $id: currentUser.$id },
                orderItems: [
                    {
                        product: { $id: productID },
                        size: { $id: sizeID },
                        color: { $id: colorID },
                        product_count: quantity,
                    },
                ],
                delivery_price: null,
                address: null,
            },
            [
                Permission.write(Role.user(currentUser.$id)),
                Permission.write(Role.label('admin')),
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
                product: { $id: productID },
                size: { $id: sizeID },
                color: { $id: colorID },
                product_count: quantity,
            },
        );

        const orderItemID = orderItem.$id;

        order.orderItems.push(orderItemID);
        await databases.updateDocument(
            databaseID,
            'orders',
            order.$id,
            {
                orderItems: order.orderItems,
            },
        );
    }
}

export { getOrders, getOrder, makeOrder, deleteOrder, addItemToCard };