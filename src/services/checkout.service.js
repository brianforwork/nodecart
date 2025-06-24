'use strict'
import { BadRequestError } from "../core/error.response.js"
import { findCartById as findCartByIdRepo } from "../models/repositories/cart.repo.js"
import { checkProductsByServer as checkProductsByServerRepo } from "../models/repositories/product.repo.js"

export class CheckOutService {
    static checkOutReview = async ({
        cartId, userId, shop_order_ids
    }) => {
        // Check CartId exists
        const foundCart = findCartByIdRepo({ cartId }) 
        
        if (!foundCart) throw new BadRequestError('Cart does not exist!')
        
        const checkOutOrder = {
            totalPrice: 0,
            shippingFee: 0,
            totalDiscount: 0,
            totalCheckOut: 0
        }, shop_order_ids_new = []

        
        for (let i = 0; i <= shop_order_ids.length(); i++) {
            const { shopId, shopDiscounts = [], itemProduct = [] } = shop_order_ids[i] 
            
            const checkProductsServer = checkProductsByServerRepo(itemProduct)

            if (!checkProductsServer[0]) throw new BadRequestError('Order is wrong!')
            
            // Total price of order
            const checkOutPrice = checkProductsServer.reduce((acc, product) => {
                return acc + ( product.quantity * product.price )
            }, 0)

            checkOutOrder.totalPrice += checkOutPrice
        }

    }

}