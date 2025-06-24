// checkout.controller.js
'use strict'

import { CREATED, OK } from "../core/success.response.js"
import { CheckOutService } from "../services/checkout.service.js"

export default class CheckOutController {
    static checkOut = async (req, res, next) => {
        const result = await CheckOutService.checkOutReview(req.body)

        return new OK({
            message: 'Check Out Cart Successfully!',
            metadata: result
        }).send(res) 
    }
}