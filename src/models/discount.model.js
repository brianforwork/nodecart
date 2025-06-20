// discount.model.js
'use strict'

import Joi from "joi"
import { ObjectId } from "mongodb"

const COLLECTION_NAME = 'Discounts'

const JoiObjectId = () =>
  Joi.string().custom((value, helpers) => {
    if (!ObjectId.isValid(value)) return helpers.error('any.invalid')
    return new ObjectId(value)
  }, 'ObjectId validation')


// Main Validation Schema
export const ValidateDiscountModel = (discountData) => {
    const discountValidationSchema = Joi.object({
        discount_name: Joi.string().required(),
        discount_description: Joi.string().required(),
        discount_type: Joi.string().default('fixed_amount'),
        discount_value: Joi.number().integer().required(),
        discount_code: Joi.string().required(),
        discount_start_date: Joi.date().required(),
        discount_end_date: Joi.date().required(),
        discount_max_used: Joi.number().integer().required(),
        discount_used: Joi.number().integer().required(),
        discount_users_used: Joi.array().default([]),
        discount_per_user: Joi.number().integer().required(),
        discount_required_price: Joi.number().integer().required(),
        discount_shopId: JoiObjectId().required(),
        
        discount_is_active: Joi.boolean().default(true),
        discount_applies_to: Joi.string().valid('all', 'specific').required(),
        discount_product_ids: Joi.array()
        .items(JoiObjectId())
        .when('discount_applies_to', {
          is: 'specific',
          then: Joi.array().min(1).required(),
          otherwise: Joi.array().default([]),
        }),
    })

    return discountValidationSchema.validate(discountData)
}
