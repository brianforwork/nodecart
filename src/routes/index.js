// routes/index.js (Main Route)
'use strict'
import express from "express"
const router = express.Router()
import accessRoute from "./access/index.js"
import createNewProductRoute from "./product/index.js"
import discountRoute from "./discount/index.js"
import cartRoute from "./cart/index.js"

router.use('/v1/api', accessRoute)
router.use('/v1/api', createNewProductRoute)
router.use('/v1/api', discountRoute)
router.use('/v1/api', cartRoute)

export default router