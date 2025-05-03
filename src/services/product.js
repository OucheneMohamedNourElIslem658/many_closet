import { ID, Query } from "appwrite";
import { account, databaseID, databases, fileStorage } from "./config";
import { date2TimeAgo } from "../commun/utils/time_formats";
import { getUser } from "./auth";

async function getColors() {
    return (await databases.listDocuments(
        databaseID,
        'colors',
    )).documents.map((color) => {
        return {
            id: color.$id,
            name: color.name,
            hex: color.code,
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

async function getProducts({currentPage, pageSize, name, tags, colors, sizes, priceRange, isAdminBoard = false}) {
    if (isAdminBoard) {
        const user = await getUser()
        const isUserAdmin = user?.labels?.includes('admin')

        if (!isUserAdmin) {
            throw new Error("Unauthorized access");
        }
    }
    
    const offset = (currentPage - 1) * pageSize
    const queries = [
        Query.limit(pageSize),
        Query.offset(offset),
        Query.orderDesc('$createdAt'),
    ]

    if (!isAdminBoard) {
        queries.push(Query.equal('is_shown', true))
    }

    if (name && name.trim().length > 0) {
        queries.push(Query.search('name', name))
    }

    if (tags && tags.length > 0) {
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
        
        products: products.documents.map((product) => {
            return {
                ...product,
                timeAgo: date2TimeAgo(product.$createdAt),
            }
        }),
        maxPages: maxPages,
    }
}

async function getProduct(id, isAdminBoard = false) {
    const queries = [
        Query.equal('$id', id),
    ]

    if (!isAdminBoard) {
        queries.push(Query.equal('is_shown', true))
    }

    let products = await databases.listDocuments(
        databaseID,
        'products',
        queries
    )

    if (products.total === 0) {
        return null
    }

    const product = products.documents[0]

    const orderItemsQuantities = product.orderItems.map((item) => item.product_count)

    product.totalOrders = orderItemsQuantities.reduce((acc, quantity) => acc + quantity, 0);

    let isAuthenticated = false

    try {
        const user = await account.get()
        isAuthenticated = user !== null
    } catch (error) {}

    return {
        ...product,
        isAuthenticated: isAuthenticated,
    }
}

async function updateProductVisibility({id, isShown}) {
    await databases.updateDocument(
        databaseID,
        'products',
        id,
        {
            is_shown: isShown,
        }
    )
}

async function createProduct({ name, description, price, available, images, colors, sizes, categories}) {
    const colorsIDs = colors.map((color) => color.id)
    const catsIDs = categories.map((cat) => cat.id)
    const sizesIDs = sizes.map((size) => size.id)

    const upLoadedImagesIDs = []

    for (let image of images) {
        const file = await fileStorage.createFile(
            'shop',
            ID.unique(),
            image,
            [],
        )

        const imageURL = fileStorage.getFilePreview(
            'shop',
            file.$id,
        )
        
        const storedImage = await databases.createDocument(
            databaseID,
            'images',
            ID.unique(),
            {
                storage_id: file.$id,
                url: imageURL
            }
        )

        upLoadedImagesIDs.push(storedImage.$id)
    }
    

    await databases.createDocument(
        databaseID,
        'products',
        ID.unique(),
        {
            name: name,
            desc: description,
            price: Number(price),
            is_available: available,
            colors_tags: colorsIDs,
            categories_tags: catsIDs,
            sizes_tags: sizesIDs,
            colors: colorsIDs,
            sizes: sizesIDs,
            categories: catsIDs,
            images: upLoadedImagesIDs,
        }
    )
}

async function updateProduct({ id, name, description, price, available, images, colors, sizes, categories, imagesToDelete}) {
    const data = {}

    if (name) {
        data.name = name
    }

    if (description) {
        data.desc = description
    }

    if (price) {
        data.price = Number(price)
    }

    if (available) {
        data.is_available = available
    }

    if (colors) {
        const colorsIDs = colors.map((color) => color.id)
        data.colors_tags = colorsIDs
        data.colors = colorsIDs
    }

    if (categories) {
        const catsIDs = categories.map((cat) => cat.id)
        data.categories_tags = catsIDs
        data.categories = catsIDs
    }

    if (sizes) {
        const sizesIDs = sizes.map((size) => size.id)
        data.sizes_tags = sizesIDs
        data.sizes = sizesIDs
    }

    if (imagesToDelete) {
        for (let image of imagesToDelete) {
            await databases.deleteDocument(
                databaseID,
                'images',
                image.id,
            )

            if (image.storage_id) {
                await fileStorage.deleteFile(
                    'shop',
                    image.storage_id,
                )
            }
        }
    }

    if (images) {
        const imagesToAdd = images.filter((image) => image.size !== 0)

        const oldProduct = await databases.getDocument(
            databaseID,
            'products',
            id,
        )

        const oldImages = oldProduct.images.map((image) => image.$id)

        const upLoadedImagesIDs = []

        for (let image of imagesToAdd) {
            const file = await fileStorage.createFile(
                'shop',
                ID.unique(),
                image,
                [],
            )

            const imageURL = fileStorage.getFilePreview(
                'shop',
                file.$id,
            )
            
            const storedImage = await databases.createDocument(
                databaseID,
                'images',
                ID.unique(),
                {
                    storage_id: file.$id,
                    url: imageURL
                }
            )

            upLoadedImagesIDs.push(storedImage.$id)
        }

        data.images = [...upLoadedImagesIDs, ...oldImages]
    }

    await databases.updateDocument(
        databaseID,
        'products',
        id,
        data,
    )
}

async function addFilter({type, data}){
    const createdFilter = await databases.createDocument(
        databaseID,
        type,
        ID.unique(),
        data,
        []
    )

    const filter = {
        id: createdFilter.$id,
        name: createdFilter.name,
        hex: createdFilter.code
    }

    return filter
}

async function deleteFilter({type, id}) {
    await databases.deleteDocument(
        databaseID,
        type,
        id
    )
}

async function getUpdateProductInfo(id) {
    const productPromise = getProduct(id, true)
    const filtersPromise = getFilters()

    const [product, filters] = await Promise.all([
        productPromise,
        filtersPromise,
    ])

    product.colors = product.colors.map((color) => ({
        id: color.$id,
        name: color.name,
        hex: color.code,
    }))

    product.categories = product.categories.map((category) => ({
        id: category.$id,
        name: category.name,
    }))

    product.sizes = product.sizes.map((size) => ({
        id: size.$id,
        name: size.name,
    }))

    return {
        product: product,
        filters: filters,
    }
}

export {getFilters, getProducts, getProduct, updateProduct, createProduct, addFilter, deleteFilter, getUpdateProductInfo, updateProductVisibility}