// models/keyToken.model.js
'use strict'
import { connectDB } from '../database/init.mongodb.js'
import { ObjectId } from 'mongodb'

const COLLECTION_NAME = 'Keys'


function normalizeObjectId(id) {
  return typeof id === 'string' ? new ObjectId(id) : id
}

export const KeyTokenModel = {
  async createOrUpdate({ userId, publicKey, refreshToken = [] }) {
    const db = await connectDB()
    const result = await db.collection(COLLECTION_NAME).updateOne(
      { user: normalizeObjectId(userId) },
      {
        $set: {
          publicKey,
          updatedAt: new Date(),
        },
        $setOnInsert: {
          user: normalizeObjectId(userId),
          createdAt: new Date(),
        },
        $addToSet: {
          refreshToken: { $each: refreshToken },
        },
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
  }
};
