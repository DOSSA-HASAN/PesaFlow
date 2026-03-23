import {errorResponse, successResponse} from "../utils/response.js";
import User from "./user.model.js";
import bcrypt from "bcryptjs"
import Till from "../models/tillNumber.model.js";
import {generateAccessToken, generateRefreshToken} from "../utils/tokenGenerator.js";
import * as userService from "./user.service.js"

/**
 * @description createUser function that is used to onboard new users to the application.
 *              Function can only be invoked by a DEVELOPER or an ADMIN
 * @param req - Express request object
 * @param res - Express request object
 */
export const createUser = async (req, res) => {
    try {
        // Extract required fields from request body
        const {email, password, role, tillId} = req.body

        const user = await userService.createUser({email, password, role, tillId})

        return successResponse(res, null, "User created successfully", 201)
    } catch (e) {
        return errorResponse(res, e.message || "Failed to create user", e.statusCode || 500, e)
    }
}

export const login = async (req, res) => {
    try {
        const {email, password} = req.body
        if (!email || !password) {
            return errorResponse(res, "Invalid credentials", 400)
        }

        // Look for user
        const user = await User.findOne({email})

        if (user == null || !user) {
            return errorResponse(res, "User not found", 401)
        }

        // compare the passwords if user exists
        const passwordMatch = await bcrypt.compare(password, user.password)

        if (!passwordMatch) {
            return errorResponse(res, "Invalid credentials", 401)
        }

        //TODO: if passwords match return the access and refresh token
        const payload = {id: user._id, email: user.email, role: user.role}
        const accessToken = generateAccessToken(payload)
        const refreshToken = generateRefreshToken(payload)
        return successResponse(res, {accessToken, refreshToken: refreshToken}, "Login successful", 200)


    } catch (e) {
        return errorResponse(res, "Failed to login", 500, e)
    }
}

export const updateUserProfile = async (req, res) => {
    try {
        const {id} = req.params
        const {data} = req.body

        if (!id) {
            return errorResponse(res, "Missing user ID")
        }

        if (!data || typeof data != "object") {
            return errorResponse(res, "Invalid data", 400)
        }

        // developer and admin can update:
        // email, password, role, tillNumber
        const allowedFields = ["email", "password", "role", "tillNumber"]

        // check if frontend has sent valid update data
        const updates = Object.keys(data)
        // validate request updates
        const isValidUpdate = updates.every(field => allowedFields.includes(field))

        if (!isValidUpdate) {
            return errorResponse(res, "You don't have permissions to update some fields")
        }

        const user = await User.findById(id)

        if (!user) {
            return errorResponse(res, "User not found", 404)
        }

        // handle data seperately
        if (data.password) {
            // hash data.password from req
            user.password = await bcrypt.hash(data.password, 10)
            delete data.password
        }

        // Apply remaining updates dynamically
        updates.forEach(field => {
            user[field] = data[field]
        })

        await user.save()

        return successResponse(res, null, `${user.email}'s details have been updated succesfully`)


    } catch (e) {
        return errorResponse(res, "Failed to update user profile", 500, e)
    }
}

export const deleteUser = async (req, res) => {
    try {
        const {id} = req.params

        if (!id) {
            return errorResponse(res, "Missing user ID", 400)
        }

        const user = await User.findById(id)

        if (!user) {
            return errorResponse(res, "User not found", 404)
        }

        if (user.role === "DEVELOPER" || user.role === "ADMIN") {
            return errorResponse(res, "Cannot delete this user", 400)
        }

        await user.deleteOne()

        return successResponse(res, null, `Account associated with email id: ${user.email} has been deleted permanently`)
    } catch (e) {
        return errorResponse(res, "Faild to delete user by ID", 500, e)
    }
}

export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find()

        if (!users) {
            return successResponse(res, null, "No users found", 200)
        }

        return successResponse(res, users, "Success", 200)
    } catch (e) {
        return errorResponse(res, "Failed to retrieve all users", 500, e)
    }
}

export const getUser = async (req, res) => {
    try {
         const {id} = req.params

        const user = await User.findById(id)

        if(!user){
            return errorResponse(res, "User not found", 404)
        }

        const {password:_, ...userWithoutPassword} = user

        return successResponse(res, ...userWithoutPassword, "Success", 200)

    } catch (e) {
        return errorResponse(res, "Failed to fetch user by ID", 500, e)
    }
}