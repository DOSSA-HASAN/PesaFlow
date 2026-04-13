import {connectRabbitMQ} from "../events/connection.js";
import {Log} from "../utils/mongoLogger.js";
import mongoose from "mongoose";
import "dotenv/config.js"

const startWorker = async () => {
    const mongoDBConnection = await mongoose.connect(process.env.MONGODB_URL)
    const channel = await connectRabbitMQ()
    const queue = "SEQUELIZE_LOGS"

    channel.assertQueue(queue, {durable: true})

    channel.consume(queue, async (msg) => {
        if (!msg) return;

        try {
            const data = JSON.parse(msg.content.toString())
            // Save to mongoDB
            const log = await Log.create({
                message: data.message,
                timing: data.timing,
                meta: data.meta,
                createdAt: data.createdAt || new Date()
            })

            channel.ack(msg)
        } catch (e) {
            console.error(`Failed to log query: ${e.message}`)
            channel.nack(msg, false, false)
        }
    })
}

startWorker()