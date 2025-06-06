//routes/access/access.service.js
'use strict'
import { ShopModel } from "../models/shop.model.js"
import bycrypt from "bcrypt"
import crypto from 'node:crypto'
import KeyTokenService from "./keyToken.service.js"
import { createTokenPair } from "../auth/authUtils.js"
import getInfoData from "../utils/index.js"
import { error } from "node:console"
import { BadRequestError } from "../core/error.response.js"

const roleShop = {
    SHOP: 'SHOP',
    WRITER: 'WRITER',
    EDITOR: 'EDITOR',
    ADMIN: 'ADMIN'
}

class AccessService {
    static signUp = async ({name, email, password}) => {
        // Check Email
        const foundShop = await ShopModel.findByEmail({ email })
        if (foundShop) {
            throw new BadRequestError('Error: Shop is already registered!')
        }
        const hashedPassword = await bycrypt.hash(password, 10)
        // const newShop = await ShopModel.insertOne({ name, email, hashedPassword, roles: [roleShop.SHOP] })
        const newShop = await ShopModel.insertOne({ name, email, password: hashedPassword, roles: [roleShop.SHOP] })
        const newShopId = newShop._id         
        console.log(newShopId)

        
        if (newShop) {

            // ASYMMETRIC JWT + RSA
            // Create privateKey (sign token) and publicKey (verify token)
            // const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
            //     modulusLength: 4096,
            //     publicKeyEncoding: {
            //       type: 'pkcs1',
            //       format: 'pem'
            //     },
            //     privateKeyEncoding: {
            //       type: 'pkcs1',
            //       format: 'pem'
            //     }
            // })
            // Save privateKey and publicKey to collection KeyStore
            // await KeyTokenService.createKeyToken({
            //     userId: newShopId,
            //     publicKey
            // })

            // const tokens = await createTokenPair({ userId: newShopId, email }, publicKey, privateKey)
            // console.log('Tokens created successfully:', tokens);

            // return {
            //     code: 201,
            //     metadata: {
            //         shop: getInfoData({fields: ['_id', 'name', 'email'], object: newShop}),
            //         tokens
            //     }
            // }


            //SYMMETRIC JWT
            const privateKey1 = crypto.randomBytes(64).toString('hex')
            const privateKey2 = crypto.randomBytes(64).toString('hex')

            await KeyTokenService.createKeyToken({ // Store a pair of key to database
                userId: newShopId,
                privateKey1,
                privateKey2
            })

            const tokens = await createTokenPair({ userId: newShopId, email }, privateKey1, privateKey2)
            console.log('Tokens created successfully:', tokens);

            return {
                code: 201,
                metadata: {
                    shop: getInfoData({fields: ['_id', 'name', 'email'], object: newShop}),
                    tokens
                }
            }
        }
        
        throw new BadRequestError('Shop creation failed')

    }

}

export default AccessService