// discount.service.js
'use strict'
import { connectDB } from "../database/init.mongodb.js"
import { ValidateDiscountModel } from "../models/discount.model.js"
import { BadRequestError } from '../core/error.response.js'
import { deleteDiscount as deleteDiscountRepo, findProductsAppliedByADiscount as findProductsAppliedByADiscountRepo } from "../models/repositories/discount.repo.js"
import { findAllDiscountsByShop as findAllDiscountsByShopRepo } from "../models/repositories/discount.repo.js"
import { getDiscountAmount as getDiscountAmountRepo } from "../models/repositories/discount.repo.js"
import { revokeUserDiscountUsage as revokeUserDiscountUsageRepo } from "../models/repositories/discount.repo.js"

const COLLECTION_NAME = 'Discounts'

export class DiscountService {

    static async createNewDiscountCode(payload) {
        const db = await connectDB()
        // Destructure the required fields
        const {
            discount_code, discount_start_date, discount_end_date, discount_is_active,
            discount_shopId, discount_required_price, discount_product_ids,
            discount_applies_to, discount_name, discount_description,
            discount_type, discount_value, discount_max_used,
            discount_used, discount_per_user
          } = payload;
          
        const { error, value: validatedData } = ValidateDiscountModel(payload);
          
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

    static async findProductsAppliedByADiscount({discount_code}) {
        return findProductsAppliedByADiscountRepo({discount_code})
    }

    static async findAllDiscountsByShop({ shopId }) {
        return await findAllDiscountsByShopRepo({ shopId });
    }

    static async getAmountDiscount({ discount_code, products }) {
        return await getDiscountAmountRepo({ discount_code, products })
    }

    static async deleteDiscount({ discountId }) {
        return await deleteDiscountRepo({ discountId });
    }

    static async revokeUserDiscountUsage({ codeId, shopId, userId }) {
        return await revokeUserDiscountUsageRepo({ codeId, shopId, userId });
      }
}