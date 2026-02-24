// Create user
// Login user
// Update user fields
// change till number for cashiers
// Delete user
// Retrieve all users

import {errorResponse, successResponse} from "../utils/response.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs"
import Till from "../models/tillNumber.model.js";
import {generateAccessToken, generateRefreshToken} from "../utils/tokenGenerator.js";

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

        // Return an error if email or password are missing
        if (!email || !password || !role) {
            return errorResponse(res, "Missing required fields", 400,)
        }

        // Check if user with email id already exists
        const existingUser = await User.findOne({email})

        // Return an error if user with email exists
        if (existingUser) {
            return errorResponse(res, "User with email already exists", 401,)
        }

        // Look up the corresponding tillId if the role is cashier
        let tillNumber;
        if (role === "CASHIER") {
            tillNumber = await Till.findOne({_id: tillId})

            // If no till found, return an error for invalid till Id
            if (tillNumber == null) {
                return errorResponse(res, "Invalid Till ID. Corresponding till number not found", 401)
            }
        }

        // hash password & create user
        const hashedPassword = await bcrypt.hash(password, 10)
        const newUser = await User.create({
            email,
            password: hashedPassword,
            role,
            tillNumber
        })

        return successResponse(res, null, "User created successfully", 201)
    } catch (e) {
        return errorResponse(res, e.message, 500, e)
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
        return errorResponse(res, "Internal Server Error", 500, e)
    }
}

export const updateUserProfile = async (req, res) => {
    try {
        const {data, userId} = req.body

        if(!userId){
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

        if(!isValidUpdate){
            return  errorResponse(res, "You don't have permissions to update some fields")
        }

        const user = await User.findById(userId)

        if(!user){
            return errorResponse(res, "User not found", 404)
        }

        // handle data seperately
        if(data.password){
            // hash data.password from req
            user.password = await bcrypt.hash(data.password, 10)
            delete data.password
        }

        // Apply remaining updates dynamically
        updates.forEach(field => {
            user[field] = data[field]
        })

        await user.save()

        return successResponse(res, null, `${user.name}'s details have been updated succesfully`)


    } catch (e) {
        return errorResponse(res, "Internal Server Error", 500, e)
    }
}