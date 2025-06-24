// routes/checkout/index.js
'use strict'

import express from "express"
import { asyncHandler } from "../../helpers/asyncHandler.js"
import CheckOutController from "../../controllers/checkout.controller.js"

const router = express.Router()

router.post('/checkout', asyncHandler(CheckOutController.checkOut))


export default router