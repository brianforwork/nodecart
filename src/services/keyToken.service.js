//service/keyToken.service.js
'use strict'

import { KeyTokenModel } from "../models/keytoken.model.js"

class KeyTokenService {
    static createKeyToken = async ({ userId, privateKey1, privateKey2 }) => {
        try {
          const result = await KeyTokenModel.createOrUpdate({
            userId, // ✅ matches "user" field in model
            // publicKey: publicKey.toString() // ASYMMETRIC
            privateKey1,
            privateKey2
          });          
          console.log('createOrUpdate result:', result); 
          return privateKey1.toString();
        } catch (error) {
          console.error('Failed to create key token:', error);
          throw error;
        }
      }
}
export default KeyTokenService