'use strict'
import express from "express"
import AccessController from "../../controllers/access.controller.js"
import { permission } from "../../auth/checkAuth.js"
import{ apiKey } from "../../auth/checkAuth.js"
const router = express.Router()

// Check API Key
router.use(apiKey)

// Check permission
router.use(permission('0000'))

// Sign Up Route
router.post('/shop/signup', AccessController.signUp)

export default router