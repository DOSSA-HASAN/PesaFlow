import express from "express"
import cors from "cors"
import "dotenv/config.js"
import userRoute from "./user/user.route.js";
import {connectDb} from "./utils/dbConnection.js";
import {connectRabbitMQ} from "./events/connection.js";

const app = express()

app.use(cors({
    origin: "*",
    credentials: true
}))

connectDb()
await connectRabbitMQ()


// Routes
app.use("/api/user", userRoute)

export default app