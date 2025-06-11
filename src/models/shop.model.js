// models/shop.model.js
'use strict'
import { connectDB } from "../database/init.mongodb.js"

const COLLECTION_NAME = 'Shops'

export const ShopModel = {
  async insertOne(shopData) {
    const db = await connectDB();
    const now = new Date();
    const email = shopData.email?.trim().toLowerCase();
  
    const shop = {
      name: shopData.name?.trim(),
      email,
      password: shopData.password,
      status: shopData.status || 'inactive',
      verify: shopData.verify ?? false,
      roles: shopData.roles || [],
      createdAt: now,
      updatedAt: now,
    };
  
    const result = await db.collection(COLLECTION_NAME).insertOne(shop);
    return { ...shop, _id: result.insertedId }; // ✅ return full shop with _id
  },

  async findByEmail(input) {
    const db = await connectDB();
  
    const email =
      typeof input === 'string'
        ? input.trim().toLowerCase()
        : input?.email?.trim().toLowerCase();
  
    if (!email) throw new Error('Invalid email input');
  
    return db.collection(COLLECTION_NAME).findOne({ email });
  },

  async findById(id) {
    const db = await connectDB();
    return db.collection(COLLECTION_NAME).findOne({ _id: id });
  },

  async updateById(id, updateData) {
    const db = await connectDB();
    return db.collection(COLLECTION_NAME).updateOne(
      { _id: id },
      { $set: { ...updateData, updatedAt: new Date() } }
    );
  },
};
