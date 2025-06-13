// routes/product/index.js
'use strict'
import express from "express"
import ProductController from "../../controllers/product.controller.js"
import { asyncHandler } from "../../helpers/asyncHandler.js"

const router = express.Router()

// Create New Product Route
router.post('/product/create', asyncHandler(ProductController.createNew))

export default router