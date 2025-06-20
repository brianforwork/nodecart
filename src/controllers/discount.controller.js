// discount.controller.js
'use strict'
import { DiscountService } from "../services/discount.service.js"
import { CREATED, OK } from "../core/success.response.js"

export default class DiscountController {
    static createNew = async (req, res, next) => {
        const result = await DiscountService.createNewDiscountCode(req.body)

        return new CREATED({
            message: 'Create New Discount Code Successfully!',
            metadata: result
        }).send(res) 
    }

    static findProductsAppliedByADiscount = async (req, res, next) => {
        const { code } = req.params
    
        const result = await DiscountService.findProductsAppliedByADiscount({ discount_code: code })
    
        return new OK({
            message: 'Find List of Applied Discount Products Successfully!',
            metadata: result
        }).send(res)
    }
    
    static findAllDiscountsByShop = async (req, res, next) => {
        const { shopId } = req.params;
      
        const result = await DiscountService.findAllDiscountsByShop({ shopId });
      
        return new OK({
          message: 'Fetched all discounts for shop successfully!',
          metadata: result
        }).send(res);
    };

    static getAmountDiscount = async (req, res, next) => {
        const discount_code = req.body.discount_code
        const products = req.body.products

        const result = await DiscountService.getAmountDiscount({ discount_code, products })

        return new OK({
            message: 'Fetched the current price after discount successfully!',
            metadata: result
        }).send(res)
    }

    static deleteDiscount = async (req, res, next) => {
        const { discountId } = req.params;
      
        const result = await DiscountService.deleteDiscount({ discountId });
      
        return new OK({
          message: 'Deleted the discount successfully!',
          metadata: result
        }).send(res);
    };

    static revokeUserDiscountUsage = async (req, res, next) => {
        const { codeId, shopId, userId } = req.body;
      
        const result = await DiscountService.revokeUserDiscountUsage({ codeId, shopId, userId });
      
        return new OK({
          message: 'User discount usage has been revoked!',
          metadata: result
        }).send(res);
    };
}