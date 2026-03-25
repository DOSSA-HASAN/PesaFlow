import amqp from "amqplib"

let channel;

export const connectRabbitMQ = async () => {
    const conn = await amqp.connect(process.env.RABBITMQ_URL)

    channel = await conn.createChannel()

    console.log("Connected to RabbitMQ ✅")

    return channel
}

export const getChanngel = () => {
    if(!channel){
        throw new AppError("RabbitMQ not connected", 500)
    }
    return channel
}