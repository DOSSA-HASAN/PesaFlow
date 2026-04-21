import { getChannel } from "../events/connection.js"
import { publishEvent } from "../events/publisher.js"
import User from "../user/user.model.js"
import { successResponse } from "../utils/response.js"
import bcrypt from "bcryptjs"
import "dotenv/config.js"

export const seedDevUser = async (req, res, next) => {
    try {

        const email = "notyetdoc911@gmail.com"
        const password = await bcrypt.hash("12345", 10) // Less secure password for testing
        const role = "developer"

        const seedUser = await User.create({
            email,
            password,
            permissions: role
        })

        await publishEvent("SEND_EMAIL", { type: "WELCOME MAIL", email: seedUser.email })

        return successResponse(res, seedUser, "User created successfully", 201)
    } catch (e) {
        console.error(e.message)
    }
}