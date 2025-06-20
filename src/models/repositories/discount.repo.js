'use strict'
import { connectDB } from "../../database/init.mongodb.js"
import { NotFoundError } from "../../core/error.response.js"
import { findAllProducts, findManyProductsByIds } from "../../models/repositories/product.repo.js"

const COLLECTION_NAME = 'Discounts'

export const findProductsAppliedByADiscount = async ({discount_code}) => {
    const db = await connectDB()

    const foundDiscount = await db.collection(COLLECTION_NAME).findOne({
        discount_code: discount_code
    })

    if (!foundDiscount) {
        throw new NotFoundError('Could not find the discount!')
    }

    if (foundDiscount.discount_applies_to === 'all') {
        return findAllProducts({ shopId: foundDiscount.discount_shopId })
    }

    else { // specific products
        return findManyProductsByIds({ ids: foundDiscount.discount_product_ids })
    }
}