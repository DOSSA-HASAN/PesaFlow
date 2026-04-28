import { errorResponse, successResponse } from "../utils/response.js";
import * as userService from "./user.service.js"
import { publishEvent } from "../events/publisher.js";
import { AppError } from "../utils/AppError.js";


export const createUser = async (req, res, next) => {
    try {
        // Extract required fields from request body
        const { email, password, roleId } = req.body

        if (!email || !password || !roleId) {
            throw new AppError("Missing required fields", 400)
        }

        const user = await userService.createUser({ email, password, roleId })

        publishEvent("SEND_EMAIL", user)

        return successResponse(res, null, "User created successfully", 201)
    } catch (e) {
        next(e)
    }
}

export const login = async (req, res, next) => {
    try {
        const { email, password } = req.body
        if (!email || !password) {
            throw new AppError("Missing required credentials", 400)
        }
        const data = await userService.login({ email, password })
        return successResponse(res, data, "Login successful", 200)
    } catch (e) {
        next(e)
    }
}

export const updateUserProfile = async (req, res, next) => {
    try {
        const { id } = req.params
        const { data } = req.body
        if (!data) {
            throw new AppError("Missing required data", 400)
        }
        const updateUser = await userService.updateUserProfile(id, data)
        return successResponse(res, updateUser, "User updated successfully", 200)
    } catch (e) {
        next(e)
    }
}

export const deleteUser = async (req, res, next) => {
    try {
        const { id } = req.params
        const deletedUser = await userService.deleteUser(id)
        return successResponse(res, null, "User deleted successfully", 200)
    } catch (e) {
        next(e)
    }
}

export const getAllUsers = async (req, res, next) => {
    try {
        const users = await userService.getAllUsers()
        return successResponse(res, users, "Success", 200)
    } catch (e) {
        next(e)
    }
}

export const getUser = async (req, res, next) => {
    try {
        const { id } = req.params
        const user = await userService.getUser(id)
        return successResponse(res, user, "Success", 200)
    } catch (e) {
        next(e)
    }
}

export const setUserRoles = async (req, res, next) => {
    try {
        const { id } = req.user
        const { roleIds } = req.body

        if (!id) {
            throw new AppError("Missing user ID")
        }
        if (!roleIds || !Array.isArray(roleIds) || roleIds.length === 0) {
            throw new AppError("Missing role IDs", 400)
        }

        await userService.setUserRoles(id, roleIds)
        return successResponse(res, null, "User role updated successfully", 200)
    } catch (e) {
        next(e)
    }
}