// models/keyToken.model.js
'use strict'
import { connectDB } from '../database/init.mongodb.js'
import { ObjectId } from 'mongodb'

const COLLECTION_NAME = 'Keys'


function normalizeObjectId(id) {
  if (!id) {
    throw new Error('normalizeObjectId received invalid id: ' + id);
  }

  return typeof id === 'string' ? new ObjectId(id) : id;
}

export const KeyTokenModel = {
  async createOrUpdate({ userId, privateKey1, privateKey2, refreshToken = [] }) {
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
    const db = await connectDB();
    return db.collection(COLLECTION_NAME).findOne({ user: normalizeObjectId(userId) });
  },

  async addRefreshToken(userId, token) {
    const db = await connectDB();
    return db.collection(COLLECTION_NAME).updateOne(
      { user: normalizeObjectId(userId) },
      {
        $addToSet: { refreshToken: token },
        $set: { updatedAt: new Date() },
      }
    );
  },

  async removeRefreshToken(userId, token) {
    const db = await connectDB();
    return db.collection(COLLECTION_NAME).updateOne(
      { user: normalizeObjectId(userId) },
      {
        $pull: { refreshToken: token },
        $set: { updatedAt: new Date() },
      }
    );
  },

  async findOneAndUpdate(filter, update, options = {}) {
    const db = await connectDB();
    return db.collection(COLLECTION_NAME).findOneAndUpdate(
      // Normalize _id if it's userId-based
      { ...filter, user: normalizeObjectId(filter.user) },
      update,
      {
        upsert: true,
        returnDocument: 'after', // Ensure updated doc is returned
        ...options
      }
    );
  }
};
