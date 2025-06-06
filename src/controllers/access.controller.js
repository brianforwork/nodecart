// controllers/access.controller.js
'use strict'

import { CREATED, OK } from "../core/success.respose.js"
import AccessService from "../services/access.service.js"

class AccessController {
    signUp = async (req, res, next) => {
        const result = await AccessService.signUp(req.body)

        return new CREATED({
            message: 'Account Registered Successfully!',
            metadata: result
        }).send(res)
    }
}

export default new AccessController()