// helpers/checkActiveConnections.js
'use strict'
// Check the number of connections to database
import { MongoClient } from "mongodb"
import dotenv from "dotenv"
dotenv.config()

const uri = process.env.DATABASE_URI
const client = new MongoClient(uri)

export default async function checkActiveConnections() {
  try {
    await client.connect()

    const adminDb = client.db().admin()
    const status = await adminDb.command({ serverStatus: 1 })

    const connections = status.connections
    // console.log("🔗 Connection Info:")
    // console.log(`• Current: ${connections.current}`)
    // console.log(`• Available: ${connections.available}`)
    // console.log(`• Total Created: ${connections.totalCreated}`)
  } catch (err) {
    console.error("❌ Error checking connections:", err)
  } finally {
    await client.close()
  }
}