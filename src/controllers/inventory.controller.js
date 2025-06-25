// inventory.controller.js
'use strict'

import { CREATED, OK } from "../core/success.response.js"
import InventoryService from "../services/inventory.service.js"

export default class InventoryController {
    static addStockToInventory = async (req, res, next) => {
        const result = await InventoryService.addStockToInventory(req.body)

        return new OK({
            message: 'Add Stock To Inventory Successfully!',
            metadata: result
        }).send(res) 
    }
}