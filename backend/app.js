import "./models/index.js"
import express from "express"
import cors from "cors"
import userRoute from "./user/user.route.js";
import { globalErrorHandler } from "./middlewares/globalErrorHandler.js";
import permissionRoute from "./rbac/permission/permission.route.js"
import roleRoute from "./rbac/role/role.route.js"
import authRoute from "./routes/auth.route.js"
import mpesaRoute from "./mpesa/mpesa.route.js"
import callbackRoute from "./mpesa/callbacks/callback.route.js"
import paymentAccountRoute from "./mpesaAccount/payment_account.route.js"

const app = express()

app.use(express.json())

app.use(cors({
    origin: "*",
    credentials: true
}))

// Routes
app.use("/api/auth", authRoute)
app.use("/api/user", userRoute)
app.use("/api/permissions", permissionRoute)
app.use("/api/roles", roleRoute)
app.use("/api/mpesa", mpesaRoute)
app.use("/api/payment_account", paymentAccountRoute)
app.use("/api/mpesa/callback", callbackRoute)


app.use(globalErrorHandler)

export default app