import { getChannel } from "./connection.js";

export const publishEvent = async (queue, data) => {
    const channel = getChannel()

    if (!channel) {
        console.warn("Skipping event (no RabbitMQ)")
        return;
    }

    const payload = {
        ...data,
        timestamp: Date.now()
    }

    channel.sendToQueue(
        queue,
        Buffer.from(JSON.stringify(payload)),
        { persistent: true }
    )
}