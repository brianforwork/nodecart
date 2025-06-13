// controllers/access.controller.js
'use strict'

import { CREATED, OK } from "../core/success.response.js"
import AccessService from "../services/access.service.js"


class AccessController {
    logIn = async (req, res, next) => {
        const result = await AccessService.logIn(req.body)

        return new OK({
            message: 'Log In Successfully!',
            metadata: result
        }).send(res)
    }

    logOut = async (req, res, next) => {
        
        const result = await AccessService.logOut(req.keyStore)

        return new OK({
            message: 'Log Out Successfully!',
            metadata: result
        }).send(res)
    }

    signUp = async (req, res, next) => {
        const result = await AccessService.signUp(req.body)

        return new CREATED({
            message: 'Account Registered Successfully!',
            metadata: result
        }).send(res)
    }

    refreshToken = async (req, res, next) => {
        const result = await AccessService.handleRefreshToken(req.body.refreshToken)

        return new CREATED({
            message: 'Access Token And Refresh Token Created Successfully!',
            metadata: result
        }).send(res)
    }
}

export default new AccessController()