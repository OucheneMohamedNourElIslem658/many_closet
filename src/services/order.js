import { Query } from "appwrite";
import { databaseID, databases } from "./config";
import { date2TimeAgo } from "../commun/utils/time_formats";

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

    const maxPages = Math.ceil(data.total / pageSize)

    return {
        orders: orders,
        maxPages: maxPages
    }
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

export { getOrders, getOrder }