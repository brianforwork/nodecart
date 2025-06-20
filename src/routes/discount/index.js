// routes/discount/index.js
'use strict'

import express from "express"
import { asyncHandler } from "../../helpers/asyncHandler.js"
import DiscountController from "../../controllers/discount.controller.js"

const router = express.Router()

router.post('/discount', asyncHandler(DiscountController.createNew))
router.get('/discount/:code/products', asyncHandler(DiscountController.findProductsAppliedByADiscount))
router.get('/discount/shop/:shopId', asyncHandler(DiscountController.findAllDiscountsByShop))
router.post('/discount/apply', asyncHandler(DiscountController.getAmountDiscount))
router.delete('/discount/delete/:discountId', asyncHandler(DiscountController.deleteDiscount))
router.patch('/discount/revoke-usage', asyncHandler(DiscountController.revokeUserDiscountUsage));


export default router