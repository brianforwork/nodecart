'use strict'
import { connectDB } from "../database/init.mongodb.js"
import { createNewCart as createNewCartRepo, deleteAProductInCart as deleteAProductInCartRepo } from "../models/repositories/cart.repo.js"
import { updateUserCartQuantity as updateUserCartQuantityRepo } from "../models/repositories/cart.repo.js"
import { findAProductById } from "../models/repositories/product.repo.js"
import { NotFoundError } from "../core/error.response.js"
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
  
  // update cart
  /*
  shop_order_ids: [
    {
      shopId,
      item_products: [
        {
          quantity,
          price,
          shopId,
          old_quantity,
          productId
        }
      ],
      version
    }
  ]
  */
  
  static async addToCartV2({ userId, shop_order_ids = [] }) {
    const { productId, old_quantity, quantity } = shop_order_ids[0]?.item_products[0]
    console.log('old quantity: ', old_quantity, ' new quantity: ', quantity)
  
    const foundProduct = await findAProductById({ productId })
    if (!foundProduct) throw new NotFoundError('Could not find the product!')
  
    if (foundProduct.product_shop.toString() !== shop_order_ids[0]?.shopId)
      throw new NotFoundError('Could not find the product!')
  
    if (quantity == 0) {
      return await deleteAProductInCartRepo({ userId, productId })
    }
  
    return await updateUserCartQuantityRepo(userId, {
      productId,
      quantity: quantity - old_quantity
    })
  }

  static async deleteAProductInCart({ userId, productId }) {
    return await deleteAProductInCartRepo( {userId, productId})
  }

}
