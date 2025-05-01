import { client, databaseID, fileStorage } from "./config";

function initFileStorageCleaner() {
    try {
        const unSubscribe = client.subscribe(`databases.${databaseID}.collections.products.documents`, async (response) => {
            if (response.events.includes(`databases.*.collections.*.documents.*.delete`)) {
                const images = response.payload.images;
                for (const image of images) {
                    const { storage_id } = image;
                    if (storage_id) {
                        await fileStorage.deleteFile('shop', storage_id)
                    }
                }
            }
        })
    
        return unSubscribe
    } catch (error) {
        console.error("Error initializing file storage cleaner:", error);
    }
}

export default initFileStorageCleaner