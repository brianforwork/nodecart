// product.service.js
'use strict'

import { ValidateProductModel, ProductModel } from "../models/product.model.js"
import { connectDB } from "../database/init.mongodb.js"
import { ObjectId } from "mongodb"
import slugify from "slugify"
import { findAllDraftsForShop as findDraftsRepo } from "../models/repositories/product.repo.js"
import { findAllPublishedForShop as findPublishedRepo } from "../models/repositories/product.repo.js"
import { findAllProducts as findAllProductsRepo } from "../models/repositories/product.repo.js"
import { publishProductByShop as publishProductRepo } from "../models/repositories/product.repo.js"
import {unPublishProductByShop as unPublishProductRepo } from "../models/repositories/product.repo.js"

// Base Product class
class Product {
  constructor({
    product_name,
    product_thumb,
    product_description,
    product_price,
    product_quantity,
    product_type,
    product_shop,
    product_attributes,
    product_slug,
    product_ratingsAverage,
    product_variations,
    isDraft,
    isPublished
  }) {
    this.product_name = product_name
    this.product_thumb = product_thumb
    this.product_description = product_description
    this.product_price = product_price
    this.product_quantity = product_quantity
    this.product_type = product_type
    this.product_shop = product_shop
    this.product_attributes = product_attributes
    this.product_slug = slugify(this.product_name)

    this.product_ratingsAverage = product_ratingsAverage
    ? Math.round(product_ratingsAverage * 10) / 10
    : 4.5 // fallback default
    
    this.isDraft = isDraft ?? true
    this.isPublished = isPublished ?? false

    this.product_variations = product_variations
  }

  async createProduct() {
    const { error, value } = ValidateProductModel(this)
    if (error) throw new Error(`Validation Error: ${error.message}`)

    // Step 1: Insert to product_type-specific collection (e.g., 'ClothingAttributes')
    const db = await connectDB()
    const collectionName = `${this.product_type}Attributes`
    const resultAttr = await db.collection(collectionName).insertOne({
      ...this.product_attributes,
      createdAt: new Date(),
      updatedAt: new Date()
    })
    if (!resultAttr.insertedId) throw new Error("Failed to create product attributes")

    // Step 2: Replace product_attributes with its _id (reference)
    const productData = {
      ...value,
      product_attributes: resultAttr.insertedId
    }

    // Step 3: Insert into Products collection
    const resultProduct = await ProductModel.createProductWithRef(productData)
    if (!resultProduct.insertedId) throw new Error("Failed to create product")

    return {
      _id: resultProduct.insertedId,
      ...productData
    }
  }



}

// Factory to route by type (optional subclass per type)
class ProductFactory {
  static async createNewProduct(type, payload) {
    switch (type) {
      case 'Clothing':
        return await new Product(payload).createProduct()
      case 'Electronics':
        return await new Product(payload).createProduct()
      case 'Furniture':
        return await new Product(payload).createProduct()
      default:
        throw new Error(`Invalid Product Type: ${type}`)
    }
  }
}

// Query: read operations
const findAllDraftsForShop = async ({ product_shop, limit = 50, skip = 0 }) => {
  const query = {
    product_shop: new ObjectId(product_shop), // ✅ IMPORTANT
    isDraft: true
  }

  return await findDraftsRepo({ query, limit, skip })
}

const findAllPublishedForShop = async ({ product_shop, limit = 50, skip = 0 }) => {
  const query = {
    product_shop: new ObjectId(product_shop), // ✅ IMPORTANT
    isPublished: true
  }

  return await findPublishedRepo({ query, limit, skip })
}

const findAllProducts = async ({
  limit = 50,
  sort = 'ctime',
  page = 1,
  filter = { isPublished: true },
  select
} = {}) => { 
  return await findAllProductsRepo({limit, sort, page, filter, select})
}

// Command: write operations
const publishProductByShop = async ({ product_shop, product_id }) => {
  return await publishProductRepo({product_shop, product_id})
}

const unPublishProductByShop = async ({ product_shop, product_id }) => {
  return await unPublishProductRepo({product_shop, product_id})
}

export { ProductFactory, findAllDraftsForShop, findAllPublishedForShop, publishProductByShop, unPublishProductByShop, findAllProducts }
