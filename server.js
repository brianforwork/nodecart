import app from './src/app.js'

const PORT = 3055

const server = app.listen(PORT, () => {
    console.log(`Server run at PORT: ${PORT}!`)
})

process.on('SIGINT', () => {
    server.close ( () => console.log(`SERVER CLOSED!`))
})