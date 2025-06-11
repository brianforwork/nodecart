// models/keyToken.model.js
'use strict'
import { connectDB } from '../database/init.mongodb.js'
import { ObjectId } from 'mongodb'

const COLLECTION_NAME = 'Keys'


function normalizeObjectId(id) {
  console.log('📛 normalizeObjectId input:', id);

  if (!id || typeof id !== 'string' || id.length !== 24 || !/^[a-fA-F0-9]{24}$/.test(id)) {
    throw new Error(`Invalid ObjectId string: ${id}`);
  }

  return new ObjectId(id);
}

export const KeyTokenModel = {
  async createOrUpdate({ userId, privateKey1, privateKey2, refreshToken = [] }) {
    console.log('CREATE OR UPDATE')
    const db = await connectDB()
    const result = await db.collection(COLLECTION_NAME).updateOne(
      { user: normalizeObjectId(userId) },
      {
        $set: {
          // publicKey, USING FOR ASYMMETRIC
          privateKey1,
          privateKey2,
          refreshToken,
          updatedAt: new Date(),
        },
        $setOnInsert: {
          user: normalizeObjectId(userId),
          refreshTokensUsed: [], 
          createdAt: new Date(),
        }
      },
      { upsert: true }
    );

    return result;
  },

  async findByUserId(userId) {
    console.log('FIND BY USER ID input:', userId);
    const db = await connectDB();
    const normalizedUserId = normalizeObjectId(userId);
    const result = await db.collection(COLLECTION_NAME).findOne({ user: normalizedUserId });
    console.log('findByUserId result:', result);
    return result;
  }  ,

  async addRefreshToken(userId, token) {
    console.log('ADD REFRESH TOKEN')
    const db = await connectDB();
    return db.collection(COLLECTION_NAME).updateOne(
      { user: normalizeObjectId(userId) },
      {
        $addToSet: { refreshToken: token },
        $set: { updatedAt: new Date() },
      }
    );
  },

  async removeRefreshToken(userId) {
    console.log('🧩 removeRefreshToken -> userId:', userId);
    const db = await connectDB();
    return db.collection(COLLECTION_NAME).updateOne(
      { user: normalizeObjectId(userId) },
      {
        $unset: { refreshToken: "" },
        $set: { updatedAt: new Date() }
      }
    );
  },

  async findOneAndUpdate(filter, update, options = {}) {
    console.log('FIND ONE AND UPDATE:', filter);
    const db = await connectDB();
  
    const userId = filter.user;
    const normalizedUserId = normalizeObjectId(userId);
  
    return db.collection(COLLECTION_NAME).findOneAndUpdate(
      { ...filter, user: normalizedUserId },
      update,
      {
        upsert: true,
        returnDocument: 'after',
        ...options
      }
    );
  }
};
