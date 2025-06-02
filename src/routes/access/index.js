'use strict'
import express, { Router } from "express"
import AccessController from "../../controllers/access.controller.js"
const router = express.Router()

// Sign Up Route

router.post('/shop/signup', AccessController.signUp)

export default router