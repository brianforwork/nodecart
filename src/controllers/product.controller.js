// controllers/product.controller.js
'use strict'

import { CREATED, OK } from "../core/success.response.js"
import {
    ProductFactory,
    findAllDraftsForShop,
    findAllPublishedForShop,
    publishProductByShop as publishProductService,
    unPublishProductByShop as unPublishProductService
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
}

export default new ProductController()