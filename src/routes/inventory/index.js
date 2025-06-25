// routes/inventory/index.js
'use strict'

import express from "express"
import { asyncHandler } from "../../helpers/asyncHandler.js"
import InventoryController from "../../controllers/inventory.controller.js"

const router = express.Router()

router.post('/inventory/add', asyncHandler(InventoryController.addStockToInventory))

export default router