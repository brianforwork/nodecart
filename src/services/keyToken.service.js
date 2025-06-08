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
  
}
export default KeyTokenService