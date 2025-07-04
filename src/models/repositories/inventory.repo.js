// inventory.repo.js
'use strict'

import { connectDB } from "../../database/init.mongodb.js"
import { ValidateInventoryModel } from "../inventory.model.js"

const COLLECTION_NAME = 'Inventories'

export const insertInventory = async ({ productId, quantity, location = "Unknown", shopId }) => {
  // 1. Validate and apply defaults
  const { error, value: validatedData } = ValidateInventoryModel({
    inven_productId: productId,
    inven_stock: quantity,
    inven_location: location,
    inven_shopId: shopId
  })

  if (error) throw new Error(`Inventory validation failed: ${error.message}`)

  // 2. Insert into MongoDB
  const db = await connectDB()
  return db.collection(COLLECTION_NAME).insertOne({
    ...validatedData,
    createdAt: new Date(),
    updatedAt: new Date()
  })
}

export const reservationInventory = async ({ productId, quantity, cartId }) => {
  const query = {
    inven_productId: productId,
    inven_stock: { $gte: quantity }
  }

  const updateSet = {
    $inc: {
      inven_stock: -quantity
    },
    $push: {
      inven_reservation: {
        quantity,
        cartId,
        createdOn: new Date() 
      }
    }
  }

  const db = await connectDB()

  return db.collection(COLLECTION_NAME).updateOne(query, updateSet, {upsert: true})

}

