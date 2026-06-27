import dns from 'node:dns';

dns.setDefaultResultOrder('ipv4first');
import "dotenv/config.js"
import app from "./app.js"
import {seedApp} from "./seeds/seedApp.js"
import {connectRabbitMQ} from "./events/connection.js";
import {connectSQL} from "./config/db.js";
import {connectRedis} from "./utils/redisClient.js";

import {getIdentifierType} from "./utils/getIdentifierType.js";
import * as http from "node:http";
import {initSocket} from "./utils/sockets.js";

const PORT = process.env.PORT

// const server = app

// server.listen(PORT, async () => {
//     console.log(`Server running on port: ${PORT}`)
// })

const startServer = async () => {
    try {
        // TODO: change cluster location, bahrain cluster doesnt work
        // await connectDb()
        await connectRabbitMQ()
        await connectRedis()
        await connectSQL()

        // if (process.env.NODE_ENV === "development") {
        //     await seedApp()
        // }

        const server = http.createServer(app)
        const socket = initSocket(server)
        server.listen(PORT, () => {
            console.log(`Server & Sockets running on port: ${PORT}`)
        })
    } catch (error) {
        console.error(error.message)
        process.exit(1)
    }
}

startServer()