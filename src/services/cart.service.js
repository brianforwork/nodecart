'use strict'
import { connectDB } from "../database/init.mongodb.js"
import { createNewCart as createNewCartRepo } from "../models/repositories/cart.repo.js"
import { updateUserCartQuantity as updateUserCartQuantityRepo } from "../models/repositories/cart.repo.js"
const COLLECTION_NAME = 'Carts'

export class CartService {
    static async addToCart({ userId, product }) {
        const db = await connectDB()
        const foundCart = await db.collection(COLLECTION_NAME).findOne({ cart_userId: userId })
      
        // Case 1: No existing cart
        if (!foundCart) {
          return await createNewCartRepo({ userId, product })  // ✅ return here
        }
      
        // Case 2: Cart exists, but no products yet
        if (!foundCart.cart_products?.length) {
          return await db.collection(COLLECTION_NAME).findOneAndUpdate(
            { cart_userId: userId, cart_state: 'active' },
            { $set: { cart_products: [product] } },
            { returnDocument: 'after' }
          )
        }
      
        // Case 3: Product already exists — increment quantity
        return await updateUserCartQuantityRepo(userId, product)
    }
}