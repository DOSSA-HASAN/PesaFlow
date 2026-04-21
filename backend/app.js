import "./models/index.js"
import express from "express"
import cors from "cors"
import "dotenv/config.js"
import userRoute from "./user/user.route.js";
import { connectDb } from "./utils/dbConnection.js";
import { connectRabbitMQ } from "./events/connection.js";
import { connectSQL } from "./config/db.js";
import { globalErrorHandler } from "./middlewares/globalErrorHandler.js";
import permissionRoute from "./rbac/permission/permission.route.js"
import roleRoute from "./rbac/role/role.route.js"
import authRoute from "./routes/auth.route.js"

const app = express()

app.use(express.json())

app.use(cors({
    origin: "*",
    credentials: true
}))

// TODO: change cluster location, bahrain cluster doesnt work
await connectDb()
await connectRabbitMQ()
await connectSQL()


// Routes
app.use("/api/auth", authRoute)
app.use("/api/user", userRoute)
app.use("/api/permissions", permissionRoute)
app.use("/api/roles", roleRoute)


app.use(globalErrorHandler)

export default app