'use strict'
import express, { Router } from "express"
const router = express.Router()
import signUpRoute from "./access/index.js"

router.use('/v1/api', signUpRoute)

export default router