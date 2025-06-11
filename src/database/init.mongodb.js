// database/init.mongodb.js
import { MongoClient, ServerApiVersion } from "mongodb"
import dotenv from "dotenv"
dotenv.config()

import config from "../configs/config.mongodb.js"

const { host, name, port } = config.db
const connectionString = `mongodb://${host}:${port}/${name}`
console.log(connectionString)

const uri = process.env.DATABASE_URI
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
})

export async function connectDB() {
  try {
    await client.connect();
    await client.db("admin").command({ ping: 1 });
    console.log("✅ Successfully connected to MongoDB!");
    
    // Return the actual application database here:
    return client.db(process.env.DB_NAME); // make sure DB_NAME is defined in .env
  } catch (err) {
    console.error("❌ MongoDB connection failed:", err);
    process.exit(1);
  }
}

export {client}