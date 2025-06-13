// product.service.js
'use strict'

import { ValidateProductModel, ProductModel } from "../models/product.model.js"
import { connectDB } from "../database/init.mongodb.js"
import { ObjectId } from "mongodb"

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
    product_attributes
  }) {
    this.product_name = product_name
    this.product_thumb = product_thumb
    this.product_description = product_description
    this.product_price = product_price
    this.product_quantity = product_quantity
    this.product_type = product_type
    this.product_shop = product_shop
    this.product_attributes = product_attributes
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

export { ProductFactory }
