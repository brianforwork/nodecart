// routes/access/index.js
'use strict'
import express from "express"
import AccessController from "../../controllers/access.controller.js"
// import { permission} from "../../auth/checkAuth.js"
// import { apiKey } from "../../auth/checkAuth.js"
import { asyncHandler } from "../../helpers/asyncHandler.js"
import { authentication } from "../../auth/authUtils.js"
const router = express.Router()

// // Check API Key
// router.use(apiKey)

// // Check permission
// router.use(permission('0000'))

// Sign Up Route
router.post('/shop/signup', asyncHandler(AccessController.signUp))

// Log In Route
router.post('/shop/login', asyncHandler(AccessController.logIn))

// Authentication
router.use(authentication)

// Log Out Route
router.post('/shop/logout', asyncHandler(AccessController.logOut))


export default router