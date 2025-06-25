// order.model.js
'use strict'

import { connectDB } from "../database/init.mongodb"

const COLLECTION_NAME = 'Orders'

export const OrderModel = {
    async createOrder (orderData) {
        const db = await connectDB()
        const collection = db.collection(COLLECTION_NAME)
      
        const now = new Date()
      
        const newOrder = {
          order_userId: orderData.order_userId, // Number
          order_checkout: orderData.order_checkout || {}, // Object
          order_shipping: orderData.order_shipping || {}, // Object
          order_payment: orderData.order_payment || {}, // Object
          order_products: orderData.order_products || [], // Array
          order_trackingNumber: orderData.order_trackingNumber || '#0000118052022',
          order_status: orderData.order_status || 'pending', // Must be validated in app
          createdOn: now,
          modifiedOn: now
        }
      
        const result = await collection.insertOne(newOrder)
        return result
    }
}

