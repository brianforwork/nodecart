// models/apikey.model.js
'use strict'
import { connectDB } from '../database/init.mongodb.js'

const COLLECTION_NAME = 'Apikeys'

export const ApiKeyModel = {
    async insertOne(apikey) {
      const db = await connectDB();
        
      const apiKey = {
        key: typeof apikey.key === 'string' && apikey.key.trim()
          ? apikey.key.trim()
          : (() => { throw new Error('Key is required and must be a non-empty string.'); })(),
      
        status: typeof apikey.status === 'boolean' ? apikey.status : true,
      
        permissions: (() => {
          const allowed = ['0000', '1111', '2222'];
          if (
            !Array.isArray(apikey.permissions) ||
            apikey.permissions.some(p => !allowed.includes(p))
          ) {
            throw new Error('Permissions must be an array with values: 0000, 1111, 2222');
          }
          return apikey.permissions;
        })()
      };
      
    
      const result = await db.collection(COLLECTION_NAME).insertOne(apiKey); 
      return {
        _id: result.insertedId,
        ...apiKey
      };
    },

    async findByIdApiKey(query) {
        const db = await connectDB();
        return db.collection(COLLECTION_NAME).findOne(query);
    },
};