// routes/discount/index.js
'use strict'

import express from "express"
import { asyncHandler } from "../../helpers/asyncHandler.js"
import DiscountController from "../../controllers/discount.controller.js"

const router = express.Router()

router.post('/discount', asyncHandler(DiscountController.createNew))
router.get('/discount/:code/products', asyncHandler(DiscountController.findProductsAppliedByADiscount))

export default router