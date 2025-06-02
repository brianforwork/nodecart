'use strict'

import { KeyTokenModel } from "../models/keytoken.model.js"

class KeyTokenService {
    static createKeyToken = async ({ userId, publicKey }) => {
        try {
          const result = await KeyTokenModel.createOrUpdate({
            user: userId, // ✅ matches "user" field in model
            publicKey: publicKey.toString()
          });          
          console.log('createOrUpdate result:', result); 
          return publicKey.toString();
        } catch (error) {
          console.error('Failed to create key token:', error);
          throw error;
        }
      }
}
export default KeyTokenService