// models/product.model.js
'use strict'

import Joi from "joi";
import { connectDB } from "../database/init.mongodb.js"

const COLLECTION_NAME = 'Products'

export const ValidateProductModel = (ProductData) => {
    const productValidationSchema = Joi.object({
        product_name: Joi.string().trim().required(),
        product_thumb: Joi.string().trim().required(),
        product_description: Joi.string().allow('', null),
        product_price: Joi.number().required(),
        product_quantity: Joi.number().integer().required(),
        product_type: Joi.string().valid('Electronics', 'Clothing', 'Furniture').required(),
        product_shop: Joi.string()
        .custom((value, helpers) => {
          if (!ObjectId.isValid(value)) return helpers.error('any.invalid')
          return new ObjectId(value) // 💡 Convert to ObjectId
        })
        .required(),
        product_attributes: Joi.alternatives()
        .conditional('product_type', {
          switch: [
            {
              is: 'Clothing',
              then: clothingAttributesSchema
            },
            {
              is: 'Electronics',
              then: electronicsAttributesSchema
            },
            {
              is: 'Furniture',
              then: Joi.object().unknown(true) // or define another schema
            }
          ],
          otherwise: Joi.forbidden()
        })
        .required()
    })
    return ProductSchema.validate(ProductData)
};

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

