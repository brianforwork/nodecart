// server.js
import app from './src/app.js'
import { connectDB, client } from './src/database/init.mongodb.js'

const PORT = process.env.PORT || 3000

connectDB().then(() => {
  const server = app.listen(PORT, () => {
    console.log(`🚀 Server is running at http://localhost:${PORT}`)
  })

  process.on('SIGINT', async () => {
    await client.close() // ✅ Properly close MongoDB
    server.close(() => {
      console.log('🛑 Server closed!')
      process.exit(0)
    })
  })
})