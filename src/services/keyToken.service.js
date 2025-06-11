//service/keyToken.service.js
'use strict'

import { KeyTokenModel } from "../models/keytoken.model.js"

class KeyTokenService {
  static createKeyToken = async ({ userId, privateKey1, privateKey2, refreshToken }) => {
    try {
      const filter = { user: userId };
      const update = {
        $set: {
          privateKey1,
          privateKey2,
          refreshToken,
          updatedAt: new Date()
        },
        $setOnInsert: {
          user: userId,
          createdAt: new Date()
        },
        $addToSet: {
          refreshTokenUsed: { $each: [] }
        }
      };
      const options = {
        upsert: true,
        returnDocument: 'after' // required by native MongoDB
      };
  
      const result = await KeyTokenModel.findOneAndUpdate(filter, update, options);
      return result?.value?.privateKey1 ?? null;
  
    } catch (error) {
      console.error('Failed to create key token:', error);
      throw error;
    }
  };
  
  static findByUserId = async (userId) => {
    console.log("FIND BY USER ID")
    return await KeyTokenModel.findByUserId(userId) 
  }

  // static async findByUserId(userId) {
  //   const db = await connectDB(); // make sure this returns the connected db
  //   return await db.collection('Keys').findOne({ user: userId });
  // }

  static removeKeyById = async (id) => {
    console.log('🔥 removeKeyById -> id:', id);
    return await KeyTokenModel.removeRefreshToken(id)
  }
}
export default KeyTokenService