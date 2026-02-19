import app from "./app.js"

const PORT = process.env.PORT

const server = app

server.listen(PORT, () => {
    console.log(`Server running on port: ${PORT}`)
})