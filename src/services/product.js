import { databaseID, databases } from "./config";

async function getColors() {
    return (await databases.listDocuments(
        databaseID,
        'colors',
        [],
    )).documents.map((color) => {
        return {
            name: color.name,
            hex: color.hex,
        }
    })
}

async function getCategories() {
    return (await databases.listDocuments(
        databaseID,
        'categories',
        [],
    )).documents.map((category) => {
        return category.name
    })
}

async function getSizes() {
    return (await databases.listDocuments(
        databaseID,
        'sizes',
        [],
    )).documents.map((size) => {
        return size.name
    })
}

async function getFilters() {
    const colors = getColors()
    const categories = getCategories()
    const sizes = getSizes()
    const prices = [
        {min: 0, max: 2000},
        {min: 2000, max: 4000},
        {min: 4000, max: 6000},
        {min: 6000, max: Infinity},
    ];

    const promise = await Promise.all([
        colors,
        categories,
        sizes,
    ])

    return {
        colors: promise[0],
        categories: promise[1],
        sizes: promise[2],
        prices: prices,
    }
}  

async function getProducts(currentPage, pageSize) {
    const products = await databases.listDocuments(
        databaseID,
        'products',
        [],
        {
            limit: pageSize,
            offset: currentPage * pageSize,
        }
    )
    return products.documents
}

export {getFilters, getProducts}