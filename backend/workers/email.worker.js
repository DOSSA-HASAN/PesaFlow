import {connectRabbitMQ} from "../events/connection.js";
import {AppError} from "../utils/AppError.js";
import {sendEmail} from "../utils/sendEmail.js";

const startWorker = async () => {
    const channel = await connectRabbitMQ()
    const queue = "SEND_EMAIL"

    await channel.assertQueue(queue, {durable: true})

    channel.consume(queue, async (msg) => {
        const data = JSON.parse(msg.content.toString())
        try {
            await sendEmail(data.email, "Welcome on board", `Use ur email: ${data.email} to login`)
            console.log(`Sending email to: ${data.email}`)

            channel.ack(msg)
        } catch (e){
            console.error(`❌ Failed to send email:\n${e.message}`)
            channel.nack(msg, false, false)
        }
    })
}

startWorker()