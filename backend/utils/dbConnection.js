import "dotenv/config.js"
import mongoose from "mongoose";

export const connectDb = async () => {
    try {
        const DATABASE_CONNECTION_URL = process.env.MONGODB_URL
        await mongoose.connect(DATABASE_CONNECTION_URL)
        console.log("Connected to mongoDB ✅")
    } catch (e) {
        console.log(`❌ Failed to connect to mongoDB: ${e} ❌`)
        process.exit(1)
    }
}