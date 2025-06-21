// cart.model.js
'use strict'

import Joi from "joi"
import { ObjectId } from "mongodb"

const COLLECTION_NAME = 'Carts'

const JoiObjectId = () =>
    Joi.string().custom((value, helpers) => {
      if (!ObjectId.isValid(value)) return helpers.error('any.invalid')
      return new ObjectId(value)
    }, 'ObjectId validation')

    
// Main Validation Schema
export const ValidateCartModel = (cartData) => {
    const cartValidationSchema = Joi.object({
        cart_state: Joi.string()
          .valid('active', 'completed', 'failed', 'pending')
          .required()
          .default('active'),
      
        cart_products: Joi.array()
          .items(
            Joi.object({
              productId: Joi.JoiObjectId().required(),   
              shopId: Joi.JoiObjectId().required(),     
              quantity: Joi.number().integer().min(1).required(),
              name: Joi.string().required(),
              price: Joi.number().min(0).required()
            })
          )
          .required()
          .default([]),
      
        cart_count_product: Joi.number().integer().min(0).default(0),
      
        cart_userId: Joi.number().required()
    })
    
    return cartValidationSchema.validate(cartData)
}