// inventory.model.js
'use strict'

import Joi from "joi"
import { ObjectId } from "mongodb"

const COLLECTION_NAME = 'Inventories'

const JoiObjectId = () =>
  Joi.string().custom((value, helpers) => {
    if (!ObjectId.isValid(value)) return helpers.error('any.invalid')
    return new ObjectId(value)
  }, 'ObjectId validation')


// Main Validation Schema
export const ValidateInventoryModel = (inventoryData) => {
    const inventoryValidationSchema = Joi.object({
      inven_productId: JoiObjectId().required(),
      inven_location: Joi.string().default('Unknown'),
      inven_stock: Joi.number().integer().min(0).required(),
      inven_shopId: JoiObjectId().required(),
      inven_reservations: Joi.array().items(Joi.object()).default([])
    })
  
    return inventoryValidationSchema.validate(inventoryData)
}
