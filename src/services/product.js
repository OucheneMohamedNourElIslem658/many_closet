import { Query } from "appwrite";
import { databaseID, databases } from "./config";

async function getColors() {
    return (await databases.listDocuments(
        databaseID,
        'colors',
        [],
    )).documents.map((color) => {
        return {
            id: color.$id,
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
        return {
            id: category.$id,
            name: category.name,
        }
    })
}

async function getSizes() {
    return (await databases.listDocuments(
        databaseID,
        'sizes',
        [],
    )).documents.map((size) => {
        return {
            id: size.$id,
            name: size.name,
        }
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

async function getProducts({currentPage, pageSize, name, tags, colors, sizes, priceRange}) {
    const offset = (currentPage - 1) * pageSize
    const queries = [
        Query.limit(pageSize),
        Query.offset(offset),
    ]

    if (name && name.trim().length > 0) {
        queries.push(Query.search('name', name))
    }

    if (tags && tags.length > 0) {
        console.log(tags);
        
        const tagQueries = tags.map(tag => Query.contains('categories_tags', tag));
        queries.push(tags.length > 1 ? Query.or(tagQueries) : tagQueries[0]);
    }

    if (colors && colors.length > 0) {
        const colorQueries = colors.map(color => Query.contains('colors_tags', color));
        queries.push(colors.length > 1 ? Query.or(colorQueries) : colorQueries[0]);
    }

    if (sizes && sizes.length > 0) {
        const sizeQueries = sizes.map(size => Query.contains('sizes_tags', size));
        queries.push(sizes.length > 1 ? Query.or(sizeQueries) : sizeQueries[0]);
    }

    if (priceRange && priceRange.min !== undefined && priceRange.max) {
        if (priceRange.max === Infinity) {
            queries.push(Query.greaterThanEqual('price', priceRange.min))
        } else {
            queries.push(Query.between('price', priceRange.min, priceRange.max))
        }
    }

    const products = await databases.listDocuments(
        databaseID,
        'products',
        queries,
    )
    
    const maxPages = Math.ceil(products.total / pageSize)
    
    return {
        products: products.documents,
        maxPages: maxPages,
    }
}

export {getFilters, getProducts}