// inventory.service.js
'use trict'

import { BadRequestError } from "../core/error.response.js"
import { connectDB } from "../database/init.mongodb.js"
import { findAProductById } from "../models/repositories/product.repo.js"

const COLLECTION_NAME = 'Inventories'

export default class InventoryService {
    static async addStockToInventory({
        stock,
        productId,
        shopId,
        location = '13426 S Tampa, FL'
    }) {
        
        const foundProduct = findAProductById({ productId }) 
        
        if (!foundProduct) throw new BadRequestError('Product is not existed!')
        
        const query = { inven_shopId: shopId, inven_productId: productId },
        updateSet = {
            $inc: {
                inven_stock: stock
            },
            $set: {
                inven_location: location
            }
        },
        options = { upsert: true }

        const db = await connectDB()
        return await db.collection(COLLECTION_NAME).findOneAndUpdate(query, updateSet, options)
    } 
}