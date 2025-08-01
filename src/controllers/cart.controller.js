// cart.controller.js
'use strict'
import { CartService } from "../services/cart.service.js"
import { CREATED, OK } from "../core/success.response.js"

export default class CartController {
    static addToCart = async (req, res, next) => {
        const result = await CartService.addToCart(req.body)

        return new CREATED({
            message: 'Create/Update Cart Successfully!',
            metadata: result
        }).send(res) 
    }

    static updateProductQuantity = async (req, res, next) => {
        const result = await CartService.addToCartV2(req.body)

        return new OK({
            message: 'Update Quantity Successfully!',
            metadata: result
        }).send(res)
    }

    static deleteAProductInCart = async (req, res, next) => {
        const result = await CartService.deleteAProductInCart({
            userId: req.body.userId,
            productId: req.params.productId
          })

        return new OK({
            message: 'Delete A Product In Cart Successfully!',
            metadata: result
        }).send(res)
    }
}