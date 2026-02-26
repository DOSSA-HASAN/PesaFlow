import express from "express"
import cors from "cors"
import "dotenv/config.js"
import userRoute from "./routes/user.route.js";
import {connectDb} from "./utils/dbConnection.js";

const app = express()

app.use(cors({
    origin: "*",
    credentials: true
}))

connectDb()

// Routes
app.use("/api/user", userRoute)

export default app