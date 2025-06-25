'use strict'

import redis from "redis"
import util from "util"
import { reservationInventory } from "../models/repositories/inventory.repo.js"

const redisClient = redis.createClient()

const pexpire = util.promisify(redisClient.pexpire).bind(redisClient)
const setnxAsync = util.promisify(redisClient.setNX).bind(redisClient)

export default class RedisService {
    static acquiredLock = async (productId, quantity, cartId) => {
        const key = `lock_v1${productId}`
        const retryTime = 10
        const expiredTime = 3000
    
        for (let i = 0; i < retryTime; i++) {
            const result = await setnxAsync(key, expiredTime) 
    
            if (result === 1) {
                // Interact with Inventory
                const isReserved = await reservationInventory({ productId, quantity, cartId })
                
                if (isReserved.modifiedCount) {
                    await pexpire(key, expiredTime)
                    return key
                }
                return null
            }
            else {
                await new Promise((resolve) => setTimeout(resolve, 100)) 
            }
        }
    }

    static releasedLock = async (keyLock) => {
        const delAsyncKey = util.promisify(redisClient.del).bind(redisClient)
        return await delAsyncKey(keyLock)
    }
}
