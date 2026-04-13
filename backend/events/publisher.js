import {getChannel} from "./connection.js";

export const publishEvent = async (queue, data) => {
    const channel = getChannel()

    channel.assertQueue(queue, {durable: true})

    channel.sendToQueue(
        queue,
        Buffer.from(JSON.stringify(data)),
        {persistent: true}
    )
}