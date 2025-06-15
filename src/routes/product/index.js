// routes/product/index.js
'use strict'
import express from "express"
import ProductController from "../../controllers/product.controller.js"
import { asyncHandler } from "../../helpers/asyncHandler.js"
import { authentication } from "../../auth/authUtils.js"

const router = express.Router()

// router.use(authentication)

// Create New Product Route
router.post('/product/create', asyncHandler(ProductController.createNew))

// Query = Read Operations
router.get('/product/drafts/all', asyncHandler(ProductController.findAllDraftsForShop))
router.get('/product/publish/all', asyncHandler(ProductController.findAllPublishedForShop))
router.get('/product/', asyncHandler(ProductController.findAllProducts))


// COMMAND = Write Operations
router.post('/product/publish/:product_id', asyncHandler(ProductController.publishProductByShop))
router.post('/product/publish/remove/:product_id', asyncHandler(ProductController.unPublishProductByShop))


export default router