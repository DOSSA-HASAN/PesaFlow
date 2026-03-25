import {getChanngel} from "./connection.js";

export const publishEvent = async (queue, data) => {
    const channel = getChanngel()

    await channel.assertQueue(queue, {durable: true})

    channel.sendToQueue(
        queue,
        Buffer.from(JSON.stringify(data)),
        {persistent: true}
    )
}