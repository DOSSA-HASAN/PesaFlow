import amqp from "amqplib"
import { AppError } from "../utils/AppError.js";

let channel;

export const connectRabbitMQ = async () => {
    const conn = await amqp.connect(process.env.RABBITMQ_URL)

    channel = await conn.createChannel()

    console.log("Connected to RabbitMQ ✅")

    await channel.assertQueue("SEND_EMAIL", { durable: true })
    await channel.assertQueue("SEQUELIZE_LOGS", { durable: true })

    return channel
}

export const getChannel = () => {
    if (!channel) {
        // throw new AppError("RabbitMQ not connected", 500)
        console.warn("RabbitMQ not ready")
        return null
    }
    return channel
}