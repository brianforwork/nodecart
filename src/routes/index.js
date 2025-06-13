// routes/index.js (Main Route)
'use strict'
import express, { Router } from "express"
const router = express.Router()
import signUpRoute from "./access/index.js"
import logInRoute from "./access/index.js"
import logOutRoute from "./access/index.js"
import createNewProductRoute from "./product/index.js"


router.use('/v1/api', signUpRoute)
router.use('/v1/api', logInRoute) 
router.use('/v1/api', logOutRoute)
router.use('/v1/api', createNewProductRoute)

export default router