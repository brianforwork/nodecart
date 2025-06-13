// product.model.js
'use strict'

import Joi from "joi"
import { ObjectId } from "mongodb"
import { connectDB } from "../database/init.mongodb.js"

const COLLECTION_NAME = 'Products'

// Attribute Schemas
const clothingAttributesSchema = Joi.object({
  brand: Joi.string().required(),
  size: Joi.string().required(),
  material: Joi.string().required()
})

const electronicsAttributesSchema = Joi.object({
  brand: Joi.string().required(),
  size: Joi.string().required(),
  material: Joi.string().required()
})

// Main Validation Schema
export const ValidateProductModel = (productData) => {
  const productValidationSchema = Joi.object({
    product_name: Joi.string().trim().required(),
    product_thumb: Joi.string().trim().required(),
    product_description: Joi.string().allow('', null),
    product_price: Joi.number().required(),
    product_quantity: Joi.number().integer().required(),
    product_type: Joi.string().valid('Clothing', 'Electronics', 'Furniture').required(),
    product_shop: Joi.string()
      .custom((value, helpers) => {
        if (!ObjectId.isValid(value)) return helpers.error('any.invalid')
        return new ObjectId(value)
      })
      .required(),
    product_attributes: Joi.alternatives().conditional('product_type', {
      switch: [
        { is: 'Clothing', then: clothingAttributesSchema },
        { is: 'Electronics', then: electronicsAttributesSchema },
        { is: 'Furniture', then: Joi.object().unknown(true) }
      ],
      otherwise: Joi.forbidden()
    }).required()
  })

  return productValidationSchema.validate(productData)
}

// Insert product into Products collection
export const ProductModel = {
  async createProductWithRef(productData) {
    const db = await connectDB()
    return await db.collection(COLLECTION_NAME).insertOne({
      ...productData,
      createdAt: new Date(),
      updatedAt: new Date()
    })
  }
}
