// cart.repo.js
'use strict'
import { connectDB } from "../../database/init.mongodb.js"
import { ObjectId } from "mongodb"
const COLLECTION_NAME = 'Carts'

export const createNewCart = async ({ userId, product }) => {
    const db = await connectDB()

    const query = { cart_userId: userId, cart_state: 'active' }
    const updateOrInsert = {
        $addToSet: {
            cart_products: product
        }
    }
    const options = { upsert: true, new: true }
    
    return await db.collection(COLLECTION_NAME).findOneAndUpdate(query, updateOrInsert, options)
}

export const updateUserCartQuantity = async (userId, product) => {
    const db = await connectDB()
    const { productId, quantity } = product
  
    const objectProductId = new ObjectId(productId)
  
    const cart = await db.collection(COLLECTION_NAME).findOne({
      cart_userId: userId,
      cart_state: 'active'
    })
  
    const productExists = cart?.cart_products?.some(p => p.productId?.toString() === objectProductId.toString())
  
    if (!productExists) {
      // Add the product to cart
      return await db.collection(COLLECTION_NAME).findOneAndUpdate(
        { cart_userId: userId, cart_state: 'active' },
        { $addToSet: { cart_products: { ...product, productId: objectProductId } } },
        { returnDocument: 'after' }
      )
    }
  
    console.log("👉 Trying to update quantity for productId:", productId)
  
    // Otherwise: increment quantity
    return await db.collection(COLLECTION_NAME).findOneAndUpdate(
      {
        cart_userId: userId,
        'cart_products.productId': objectProductId,
        cart_state: 'active'
      },
      {
        $inc: { 'cart_products.$.quantity': quantity }
      },
      { returnDocument: 'after', returnOriginal: false }
    )
  }
  

export const deleteAProductInCart = async ({ userId, productId }) => {
  const db = await connectDB()

  const objectProductId = new ObjectId(productId)

  const query = { cart_userId: userId, cart_state: 'active' }
  const updateSet = {
    $pull: {
      cart_products: {
        productId: objectProductId
      }
    }
  }

  console.log("🧪 Delete query:", query)
  console.log("🧪 UpdateSet:", updateSet)

  return await db.collection(COLLECTION_NAME).updateOne(query, updateSet)
  
}
  
export const findCartById = async ({ cartId }) => {

  const db = await connectDB()

  const objectCartId = new ObjectId(cartId)

  return await db.collection(COLLECTION_NAME).findOne({
    _id: objectCartId,
    cart_state: 'active'
  })
}