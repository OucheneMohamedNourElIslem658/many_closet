import { databaseID, databases } from "./config";

async function getOrders() {
    const orders = await databases.listDocuments(
        databaseID,
        'orders',
        [],
    )

    const orderItemsPrices = orders.documents.map((order) => {
        return order.orderItems.map((item) => {
            return item.product.price
        })
    })

    const itemsPrice = orderItemsPrices.flat().reduce((sum, price) => sum + price, 0);

    return orders.documents.map((order) => {
        const price = itemsPrice + order.delivery_price.price
        
        return {
            id: order.$id,
            price: order.price,
            timeAgo: date2TimeAgo(order.$updatedAt),
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
}

async function getOrder(id) {
    const order = await databases.getDocument(
        databaseID,
        'orders',
        id,
    )

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
        timeAgo: date2TimeAgo(order.$updatedAt),
        status: order.status,
        items: order.orderItems.map((item) => {
            return {
                name: item.product.name,
                quantity: item.quantity,
                color: item.color.name,
                size: item.size.name,
                picURL: item.product.images?.[0]?.url || null
            }
        })
    }
}

function date2TimeAgo(date) {
    const time = new Date(date).getTime()
    const now = new Date().getTime()
    const diff = now - time

    if (diff < 1000 * 60) {
        return Math.floor(diff / 1000) + ' seconds ago'
    } else if (diff < 1000 * 60 * 60) {
        return Math.floor(diff / (1000 * 60)) + ' minutes ago'
    } else if (diff < 1000 * 60 * 60 * 24) {
        return Math.floor(diff / (1000 * 60 * 60)) + ' hours ago'
    } else {
        return Math.floor(diff / (1000 * 60 * 60 * 24)) + ' days ago'
    }
}

export { getOrders, getOrder }