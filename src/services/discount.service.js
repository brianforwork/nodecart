// discount.service.js
'use strict'
import { connectDB } from "../database/init.mongodb.js"
import { ValidateDiscountModel } from "../models/discount.model.js"
import { BadRequestError, NotFoundError } from '../core/error.response.js'

const COLLECTION_NAME = 'Discounts'

export class DiscountService {

    static async createNewDiscountCode(payload) {
        const db = await connectDB()
        // Destructure the required fields
        const {
            code, start_date, end_date, is_active,
            shopId, min_order_value, product_ids, applies_to, name, description,
            type, value, max_value, max_uses, uses_count, max_uses_per_user
          } = payload

        // Validate the discount data
        const { error, value: validatedData } = ValidateDiscountModel({
            discount_code: code,
            discount_name: name,
            discount_description: description,
            discount_type: type,
            discount_value: value,
            discount_start_date: start_date,
            discount_end_date: end_date,
            discount_max_used: max_uses,
            discount_used: uses_count,
            discount_per_user: max_uses_per_user,
            discount_required_price: min_order_value,
            discount_shopId: shopId,
            // discount_users_used: [] // set default here if needed
        });
        
        // Handle validation error
        if (error) {
            throw new BadRequestError(`Validation Error: ${error.message}`);
        }

        // Insert the discount into the database
        const result = await db.collection('Discounts').insertOne({
            ...validatedData,
            createdAt: new Date(),
            updatedAt: new Date()
        });
        
        // Optional: Return the inserted ID or result
        return {
            acknowledged: result.acknowledged,
            insertedId: result.insertedId
        };

    }

    

}