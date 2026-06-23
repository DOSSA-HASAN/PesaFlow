// check for users access token from auth header make sure it starts with Bearer, decode it
// if decoding was success return the user and

import User from "../user/user.model.js";
import { errorResponse } from "../utils/response.js";
import jwt from "jsonwebtoken"

export const verifyUser = async (req, res, next) => {
    const authHeader = req.headers['authorization']
    if (!authHeader) {
        return errorResponse(res, "Missing authentication header", 401)
    }

    if (!authHeader.startsWith("Bearer ")) {
        return errorResponse(res, "Invalid authentication header", 401)
    }

    try {
        const token = authHeader.split(" ")[1]
        const JWT_ACCESS_TOKEN_SECRET = process.env.ACCESS_SECRET
        const decoded = jwt.verify(token, JWT_ACCESS_TOKEN_SECRET)
        if (!decoded) {
            return errorResponse(res, "Invalid token", 401)
        }

        const userInstance = await User.findByPk(decoded.id)

        req.user = userInstance
        next()
    } catch (e) {
        return errorResponse(res, "Invalid or expired token. Login again.", 401, e)
    }
}