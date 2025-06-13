// product.repo.js
'use strict'

import { connectDB } from '../../database/init.mongodb.js'
import { ObjectId } from 'mongodb'

export const findAllDraftsForShop = async ({ query, limit, skip }) => {
  const db = await connectDB()

  return await db.collection('Products')
    .find({
      ...query,
      product_shop: new ObjectId(query.product_shop)
    })
    .sort({ updatedAt: -1 })
    .skip(skip)
    .limit(limit)
    .toArray()
}

export const findAllPublishedForShop = async ({ query, limit, skip }) => {
  const db = await connectDB()

  return await db.collection('Products')
    .find({
      ...query,
      product_shop: new ObjectId(query.product_shop)
    })
    .sort({ updatedAt: -1 })
    .skip(skip)
    .limit(limit)
    .toArray()
}

export const publishProductByShop = async ({ product_shop, product_id }) => {
  const db = await connectDB()
  const query = {
    _id: new ObjectId(product_id),
    product_shop: new ObjectId(product_shop)
  }

  const update = {
    $set: {
      isDraft: false,
      isPublished: true,
      updatedAt: new Date()
    }
  }

  const result = await db.collection('Products').updateOne(query, update)

  if (result.modifiedCount === 0) {
    throw new Error("Product not found or already published")
  }

  return result
}

export const unPublishProductByShop = async ({ product_shop, product_id }) => {
  const db = await connectDB()
  const query = {
    _id: new ObjectId(product_id),
    product_shop: new ObjectId(product_shop)
  }

  const update = {
    $set: {
      isDraft: true,
      isPublished: false,
      updatedAt: new Date()
    }
  }

  const result = await db.collection('Products').updateOne(query, update)

  if (result.modifiedCount === 0) {
    throw new Error("Product not found or already unpublished")
  }

  return result
}
