// app.js
import express from "express"
import mainRoutes from "../src/routes/index.js"
import morgan from "morgan"
import helmet from "helmet"
import compression from "compression"
// import checkActiveConnections from "./helpers/checkActiveConnections.js"
// import checkOverLoad from "./helpers/checkOverLoad.js"
const app = express()

// Initilize Middlewares
app.use(morgan('dev')) // Logs incoming HTTP requests to the console.
app.use(helmet()) // Secures your app by setting various HTTP headers.
app.use(compression()) // Compresses response bodies (e.g., GZIP).
app.use(express.json());
app.use(express.urlencoded({
    extended: true
}))

// checkActiveConnections()
// checkOverLoad()

// Initilize Routes
app.use('/', mainRoutes)

// Handle Error
app.use((req, res, next) => {
    const error = new Error('Not Found') 
    error.status = 404
    next(error)
})

app.use((error, req, res, next) => {
    const statusCode = error.status || 500
    return res.status(statusCode).json({
        status: 'error',
        code: statusCode || 500,
        message: error.message || 'Internal Error!'
    })
})


export default app

