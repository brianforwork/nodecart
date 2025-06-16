// controllers/product.controller.js
'use strict'

import { CREATED, OK } from "../core/success.response.js"
import {
    ProductFactory,
    findAllDraftsForShop,
    findAllProducts,
    findAllPublishedForShop,
    publishProductByShop as publishProductService,
    unPublishProductByShop as unPublishProductService,
    findAProductById as findAProductByIdService,
    updateProductById as updateProductByIdService
} from "../services/product.service.js"

class ProductController {
    createNew = async (req, res, next) => {
        const result = await ProductFactory.createNewProduct(req.body.product_type, req.body)

        return new CREATED({
            message: 'Create New Product Successfully!',
            metadata: result
        }).send(res)
    }

    findAllDraftsForShop = async (req, res, next) => {
        const result = await findAllDraftsForShop({
            product_shop: '665c94f1e87cc77106ae0df2'
        })

        return new OK({
            message: 'Retrieve Full List Of Drafts Successfully!',
            metadata: result
        }).send(res)
    }

    findAllPublishedForShop = async (req, res, next) => {
        const result = await findAllPublishedForShop({
            product_shop: '665c94f1e87cc77106ae0df2'
        })

        return new OK({
            message: 'Retrieve Full List Of Published Products Successfully!',
            metadata: result
        }).send(res)
    }

    findAllProducts = async (req, res, next) => {
        const result = await findAllProducts()

        return new OK({
            message: 'Fetched products successfully!',
            metadata: result
        }).send(res)
    }

    findAProductById = async (req, res, next) => {
        const result = await findAProductByIdService({
            productId: req.params.product_id
        })

        return new OK({
            message: 'Find a product successfully!',
            metadata: result
        }).send(res)
    }

    publishProductByShop = async (req, res, next) => {
        const result = await publishProductService({
            product_shop: req.body.product_shop,
            product_id: req.params.product_id  
          })

        return new OK({
            message: 'Publish A Product Successfully!',
            metadata: result
        }).send(res)
    }

    unPublishProductByShop = async (req, res, next) => {
        const result = await unPublishProductService({
            product_shop: req.body.product_shop,
            product_id: req.params.product_id  
          })

        return new OK({
            message: 'UnPublish A Product Successfully!',
            metadata: result
        }).send(res)
    }

    updateProductById = async (req, res, next) => {
        const { productId } = req.params
        const payloadUpdate = req.body

        const result = await updateProductByIdService(productId, payloadUpdate)

        if (!result.value) {
            throw new NotFoundError('Product not found')
        }

        return new OK({
            message: 'Update A Product successfully!',
            metadata: result
        }).send(res)
    }
}

export default new ProductController()