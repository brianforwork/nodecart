// controllers/product.controller.js
'use strict'

import { CREATED } from "../core/success.response.js"
import { ProductFactory } from "../services/product.service.js"

class ProductController {
    createNew = async (req, res, next) => {
        const result = await ProductFactory.createNewProduct(req.body.product_type, req.body)

        return new CREATED({
            message: 'Create New Product Successfully!',
            metadata: result
        }).send(res)
    }
}

export default new ProductController()