'use strict'
import { connectDB } from "../../database/init.mongodb.js"
import { ObjectId } from "mongodb"
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

export const findAllDiscountsByShop = async ({ shopId }) => {
    const db = await connectDB()
  
    const discounts = await db.collection(COLLECTION_NAME).find({
      discount_shopId: new ObjectId(shopId)
    }).project({
        discount_name: 1,
        discount_code: 1,
        discount_description: 1,
        _id: 0 // optional: hide _id if you don't want it
    }).toArray();
  
    return discounts;
};

export const checkDiscountExistence = async ({ discount_code }) => {
    const db = await connectDB()

    const existDiscount = await db.collection(COLLECTION_NAME).findOne({
        discount_code: discount_code
    })

    return existDiscount
}

export const getDiscountAmount = async ({ discount_code, products }) => {
    const db = await connectDB();
  
    const foundDiscount = await checkDiscountExistence({ discount_code });
    if (!foundDiscount) throw new Error('Discount does not exist!');
  
    const {
      discount_is_active,
      discount_max_uses,
      discount_required_price,
      discount_start_date,
      discount_end_date,
      discount_type,
      discount_value
    } = foundDiscount;
  
    if (!discount_is_active) {
      throw new Error('Discount is expired or inactive!');
    }
  
    if (discount_max_uses <= 0) {
      throw new Error('Discount has no remaining uses!');
    }
  
    const now = new Date();
    if (now < new Date(discount_start_date) || now > new Date(discount_end_date)) {
      throw new Error('Discount code is outside the valid time range!');
    }
  
    console.log(`Products in calculating::: `, products)
  

  
    // Compute total order value
    const totalOrder = Array.isArray(products)
      ? products.reduce((sum, product) => {
          const quantity = Number(product?.quantity) || 0;
          const price = Number(product?.price) || 0;
          return sum + quantity * price;
        }, 0)
      : 0;
  
    console.log(`Total Price::: `, totalOrder)
  
    // Validate minimum order value
    if (
      typeof discount_required_price === 'number' &&
      discount_required_price > 0 &&
      totalOrder < discount_required_price
    ) {
      throw new Error(
        `This discount requires a minimum order value of ${discount_required_price}, but your total is ${totalOrder}.`
      );
    }
  
    // Calculate discount
    const amountDiscount =
      discount_type === 'fixed amount'
        ? discount_value
        : totalOrder * (discount_value / 100);
  
    return {
      totalOrder,
      discount: amountDiscount,
      totalPrice: totalOrder - amountDiscount
    };
};
  
export const deleteDiscount = async ({ discountId }) => {
    const db = await connectDB();
  
    const deleted = await db.collection('Discounts').deleteOne({
      _id: new ObjectId(discountId)
    });
  
    if (deleted.deletedCount === 0) {
      throw new NotFoundError('Discount not found or already deleted.');
    }
  
    return { deleted };
};

export const revokeUserDiscountUsage = async ({ codeId, shopId, userId }) => {
    const db = await connectDB();
  
    // Step 1: Find the discount by code and shopId
    const foundDiscount = await db.collection('Discounts').findOne({
      discount_code: codeId,
      discount_shopId: new ObjectId(shopId)
    });
  
    if (!foundDiscount) {
      throw new NotFoundError('Discount not found.');
    }
  
    // Optional: Check if user actually used this discount
    // if (!foundDiscount.discount_users_used.includes(userId)) {
    //   throw new NotFoundError('User has not used this discount.');
    // }
  
    // Step 2: Update the discount to revoke usage
    const result = await db.collection('Discounts').updateOne(
        { _id: foundDiscount._id },
        {
            $pull: { discount_users_used: userId },   
            $inc: {
            discount_max_used: 1,                  
            discount_used: -1
            },
            $set: { updatedAt: new Date() }
        }
    );
  
    if (result.modifiedCount === 0) {
      throw new Error('Failed to revoke discount usage.');
    }
  
    return {
      acknowledged: result.acknowledged,
      modifiedCount: result.modifiedCount
    };
};