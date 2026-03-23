import {errorResponse, successResponse} from "../utils/response.js";
import User from "./user.model.js";
import bcrypt from "bcryptjs"
import Till from "../models/tillNumber.model.js";
import {generateAccessToken, generateRefreshToken} from "../utils/tokenGenerator.js";
import * as userService from "./user.service.js"


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
        const data = await userService.login({email, password})
        return successResponse(res, data, "Login successful", 200)

    } catch (e) {
        return errorResponse(res, e.message || "Failed to login", e.statusCode || 500, e)
    }
}

export const updateUserProfile = async (req, res) => {
    try {
        const {id} = req.params
        const {data} = req.body

        const updatedUser = await  userService.updateUserProfile({id, data})

        return successResponse(res, null, updatedUser, 200)

    } catch (e) {
        return errorResponse(res, e.message || "Failed to update user profile", e.statusCode || 500, e)
    }
}

export const deleteUser = async (req, res) => {
    try {
        const {id} = req.params

        const deletedUser = await userService.deleteUser({id})

        return successResponse(res, null, deletedUser)
    } catch (e) {
        return errorResponse(res, e.message || "Faild to delete user by ID", e.statusCode || 500, e)
    }
}

export const getAllUsers = async (req, res) => {
    try {
        const users = await userService.getAllUsers()

        return successResponse(res, users, "Success", 200)
    } catch (e) {
        return errorResponse(res, e.message || "Failed to retrieve all users", e.statusCode || 500, e)
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