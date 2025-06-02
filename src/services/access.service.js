'use strict'
import { ShopModel } from "../models/shop.model.js"
import bycrypt from "bcrypt"
import crypto from 'node:crypto'
import KeyTokenService from "./keyToken.service.js"
import { createTokenPair } from "../auth/authUtils.js"
import getInfoData from "../utils/index.js"

const roleShop = {
    SHOP: 'SHOP',
    WRITER: 'WRITER',
    EDITOR: 'EDITOR',
    ADMIN: 'ADMIN'
}

class AccessService {
    static signUp = async ({name, email, password}) => {
        try {
            // Check Email
            const foundShop = await ShopModel.findByEmail({ email })
            if (foundShop) {
                return {
                    code: 'xxxxAAA',
                    message: 'Shop already registered.'
                }
            }
            const hashedPassword = await bycrypt.hash(password, 10)
            // const newShop = await ShopModel.insertOne({ name, email, hashedPassword, roles: [roleShop.SHOP] })
            const newShop = await ShopModel.insertOne({ name, email, hashedPassword, roles: [roleShop.SHOP] });
            const newShopId = newShop.insertedId;
            console.log(typeof(newShopId))

            
            if (newShop) {
                // Create privateKey (sign token) and publicKey (verify token)
                const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
                    modulusLength: 4096,
                    publicKeyEncoding: {
                      type: 'pkcs1',
                      format: 'pem'
                    },
                    privateKeyEncoding: {
                      type: 'pkcs1',
                      format: 'pem'
                    }
                  })

                console.log({ privateKey, publicKey })
                console.log(typeof publicKey);  // string
                console.log(typeof privateKey); // string


                // Save privateKey and publicKey to collection KeyStore
                await KeyTokenService.createKeyToken({
                    userId: newShopId,
                    publicKey
                })
                // console.log('Public Key String: ', publicKeyString)
                // if (!publicKeyString) {
                //     return {
                //         code: 'xyxy',
                //         message: 'publicKeyString error.'
                //     }
                // }
                // const publicKeyObject = crypto.createPublicKey(publicKeyString)
                // console.log('Public Key Object: ', publicKeyObject)
                // Create Tokens
                // const tokens = await createTokenPair({ userId: newShopId, email }, publicKeyObject, privateKey)
                const tokens = await createTokenPair({ userId: newShopId, email }, publicKey, privateKey)
                console.log('Tokens created successfully:', tokens);

                return {
                    code: 201,
                    metadata: {
                        shop: getInfoData({fields: ['_id', 'name', 'email'], object: newShop}),
                        tokens
                    }
                }
            }
            
            return {
                code: 200,
                metadata: null
            }

        } catch (error) {
            return {
                code: 'xxx',
                message: error.message,
                status: 'error'
            }
        }
    }

}

export default AccessService