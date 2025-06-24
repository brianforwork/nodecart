'use strict'
import { BadRequestError } from "../core/error.response.js"
import { findCartById as findCartByIdRepo } from "../models/repositories/cart.repo.js"
import { checkProductsByServer as checkProductsByServerRepo } from "../models/repositories/product.repo.js"
import { getDiscountAmount as getDiscountAmountRepo } from "../models/repositories/discount.repo.js"

export class CheckOutService {
    static checkOutReview = async ({
        cartId, userId, shop_order_ids
    }) => {
        // Check CartId exists
        const foundCart = await findCartByIdRepo({ cartId }) 
        
        if (!foundCart) throw new BadRequestError('Cart does not exist!')
        
        const checkOutOrder = {
            totalPrice: 0,
            shippingFee: 0,
            totalDiscount: 0,
            totalCheckOut: 0
        }, shop_order_ids_new = []

        
        for (let i = 0; i < shop_order_ids.length; i++) {
            const { shopId, shop_discounts = [], item_products = [] } = shop_order_ids[i] 
            
            const checkProductsServer = await checkProductsByServerRepo(item_products)

            if (!checkProductsServer[0]) throw new BadRequestError('Order is wrong!')
            
            console.log('Discount products:', checkProductsServer);
            
            // Total price of order
            const checkOutPrice = checkProductsServer.reduce((acc, product) => {
                return acc + ( product.quantity * product.price )
            }, 0)

            // Initial total 
            checkOutOrder.totalPrice += checkOutPrice

            const itemCheckOut = {
                shopId,
                shop_discounts,
                priceRaw: checkOutPrice,
                priceApplyDiscount: checkOutPrice,
                item_products: checkProductsServer
            }

            console.log(`Shop Discount Length::: `, shop_discounts.length)

            if (shop_discounts.length > 0) {
                const { totalPrice, discount } = await getDiscountAmountRepo({
                    discount_code: shop_discounts[0].codeId,
                    products: checkProductsServer
                })

                console.log(`CodeID: ${shop_discounts[0].codeId}`)

                checkOutOrder.totalDiscount += discount

                if (discount > 0) {
                    itemCheckOut.priceApplyDiscount = checkOutPrice - discount
                }
            }
            
            checkOutOrder.totalCheckOut += itemCheckOut.priceApplyDiscount
            shop_order_ids_new.push(itemCheckOut)
        }

        return {
            shop_order_ids,
            shop_order_ids_new, 
            checkOutOrder
        }

    }

}