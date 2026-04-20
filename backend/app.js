import express from "express"
import cors from "cors"
import "dotenv/config.js"
import userRoute from "./user/user.route.js";
import {connectDb} from "./utils/dbConnection.js";
import {connectRabbitMQ} from "./events/connection.js";
import {connectSQL} from "./config/db.js";
import {globalErrorHandler} from "./middlewares/globalErrorHandler.js";

const app = express()

app.use(cors({
    origin: "*",
    credentials: true
}))

// TODO: change cluster location, bahrain cluster doesnt work
await connectDb()
await connectRabbitMQ()
await connectSQL()


// Routes
app.use("/api/user", userRoute)


app.use(globalErrorHandler)

export default app