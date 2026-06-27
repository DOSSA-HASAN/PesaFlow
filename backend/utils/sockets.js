import {Server} from "socket.io";
import {AppError} from "./AppError.js";
import jwt from "jsonwebtoken";
import "dotenv/config.js"

let io

export const initSocket = (server) => {
    io = new Server(server, {
        cors: {
            origin: "*", methods: ["GET", "POST"]
        }
    })

    io.use((socket, next) => {
        try {
            const token = socket.handshake.auth?.token
            if (!token) {
                return next(new Error("Missing token"))
            }
            const decoded = jwt.verify(token, process.env.ACCESS_SECRET)
            socket.userId = decoded.id
            return next()
        } catch (e) {
            return next(new Error("Unauthorized"))
        }
    })

    io.on("connection", (socket) => {
        console.log("Connected ")
        socket.join(`user:${socket.userId}`)

        socket.on("disconnect", () => {
            console.log("Disconnected")
        })
    })
}

export const emitToUser = (userId, event, data) => {
    if (!io) {
        throw new AppError("Sockets not established", 400)
    }

    if (!userId || !event || !data) {
        throw new AppError("Unable to emit data. Missing required information", 400)
    }

    io.to(`user:${userId}`).emit(event, data)
}