import express from "express"
import morgan from "morgan"
import helmet from "helmet"
import compression from "compression"
import checkActiveConnections from "./helpers/checkActiveConnections.js"
import checkOverLoad from "./helpers/checkOverLoad.js"
const app = express()

// Initilize Middlewares
app.use(morgan('dev')) // Logs incoming HTTP requests to the console.
app.use(helmet()) // Secures your app by setting various HTTP headers.
app.use(compression()) // Compresses response bodies (e.g., GZIP).

// Initilize Database
checkActiveConnections()
checkOverLoad()

// Initilize Routes
app.get('/', (req, res) => {
    return res.status(200).json({
        message: "NodeCart..." 
    })
})
// Handle Error

export default app

