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
}