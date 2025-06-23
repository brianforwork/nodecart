// routes/cart/index.js
'use strict'

import express from "express"
import CartController from "../../controllers/cart.controller.js"
import { asyncHandler } from "../../helpers/asyncHandler.js"

const router = express.Router()

router.post('/cart/update', asyncHandler(CartController.addToCart))
router.post('/cart/update-quantity', asyncHandler(CartController.updateProductQuantity))
router.delete('/cart/:productId', asyncHandler(CartController.deleteAProductInCart))

export default router