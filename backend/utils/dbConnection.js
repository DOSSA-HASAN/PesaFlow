import "dotenv/config.js"
import mongoose from "mongoose";

export const connectDb = async () => {
    try {
        const DATABASE_CONNECTION_URL = process.env.DB_URL
        console.log(DATABASE_CONNECTION_URL)
        await mongoose.connect(DATABASE_CONNECTION_URL)
        console.log("Connected to database")
    } catch (e) {
        console.log(`Failed to connect to database: ${e}`)
        process.exit(1)
    }
}