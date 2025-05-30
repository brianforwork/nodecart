// src/helpers/checkOverload.js
'use strict'

import dotenv from "dotenv"
import os from "os"
import process from "process"
import { MongoClient } from "mongodb"
import checkActiveConnections from "./checkActiveConnections.js"

dotenv.config()

const uri = process.env.DATABASE_URI
const client = new MongoClient(uri)
const _SECOND = 5000

export default async function checkOverload() {
  try {
    await client.connect()
    console.log("✅ MongoDB connected for overload monitoring")

    setInterval(async () => {
      try {
        const currentConnections = await checkActiveConnections(client)
        const numCores = os.cpus().length
        const memoryUsage = process.memoryUsage().rss
        const maxConnections = numCores * 5

        console.log(`🧠 CPU cores: ${numCores}`)
        console.log(`🔌 Current connections: ${currentConnections}`)
        console.log(`🧠 Memory usage: ${(memoryUsage / 1024 / 1024).toFixed(2)} MB`)

        if (currentConnections > maxConnections) {
          console.log("⚠️ Server is overloaded!")
        }

      } catch (err) {
        console.error("❌ Error during overload check:", err)
      }
    }, _SECOND)

    process.on('SIGINT', async () => {
      await client.close()
      console.log('🛑 MongoDB monitoring stopped')
      process.exit(0)
    })

  } catch (err) {
    console.error("❌ Could not connect MongoDB for overload check:", err)
  }
}
