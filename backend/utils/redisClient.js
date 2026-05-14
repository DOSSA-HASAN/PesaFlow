import {createClient} from "redis"
import "dotenv/config.js"

console.log(process.env.REDIS_URL)

const redisClient = createClient({
    url: process.env.REDIS_URL
})

redisClient.on("error", (err) => {
    console.error("❌ Redis error: ", err)
})

redisClient.on("connect", () => {
    console.log("✅ Connected to redis")
})

redisClient.on("end", () => {
    console.log("❌ Closed redis connected")
})

redisClient.on("reconnecting", () => {
    console.log("🔃 Redis reconnecting")
})

export const connectRedis = async () => {
    if(!redisClient.isOpen){
        await redisClient.connect()
    }
}

export default redisClient