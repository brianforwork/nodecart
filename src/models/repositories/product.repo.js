// product.repo.js
'use strict'

import { connectDB } from '../../database/init.mongodb.js'
import { ObjectId } from 'mongodb'
import { getSelectData } from '../../utils/index.js'

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

export const findAllProducts = async ({
  limit = 50,
  sort = 'ctime',
  page = 1,
  filter = { isPublished: true },
  select
} = {}) => {
  const db = await connectDB()

  const numPageSkip = (page - 1) * limit
  const sortBy = sort === 'ctime' ? { _id: -1 } : { _id: 1 }

  return await db.collection('Products')
    .find({
    ... filter
    })
    .sort(sortBy)
    .skip(numPageSkip)
    .limit(limit)
    .project(getSelectData(select))
    .toArray()
}

export const findAProductById = async ({ productId }) => {
  const db = await connectDB()

  return await db.collection('Products').findOne({ _id: new ObjectId(productId) })
  
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

export const updateProductById = async ({ productId, payloadUpdate }) => {

  const db = await connectDB()
  const filter = { _id: new ObjectId(productId) }

  // Don’t flatten product_attributes — it's a reference
  delete payloadUpdate.product_attributes

  const result = await db.collection('Products').findOneAndUpdate(
    filter,
    { $set: payloadUpdate },
    { returnDocument: 'after' }
  )


  return result
}

export const findManyProductsByIds = async ({ ids }) => {
  const db = await connectDB()

  const objectIds = ids.map(id => new ObjectId(id))

  const products = await db.collection('Products').find({
    _id: { $in: objectIds }
  }).toArray()

  return products
}