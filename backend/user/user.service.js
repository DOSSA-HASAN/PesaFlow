import {errorResponse, successResponse} from "../utils/response.js";
import User from "./user.model.js";
import Till from "../models/tillNumber.model.js";
import bcrypt from "bcryptjs";
import {AppError} from "../utils/AppError.js";
import {generateAccessToken, generateRefreshToken} from "../utils/tokenGenerator.js";

export const createUser = async ({email, password, role, tillId}) => {
    // Return an error if email or password are missing
    if (!email || !password || !role) {
        throw new AppError("Missing required fields", 400)
    }

    // Check if user with email id already exists
    const existingUser = await User.findOne({email})

    // Return an error if user with email exists
    if (existingUser) {
        throw new AppError("User with email already exists", 401)
    }

    // Look up the corresponding tillId if the role is cashier
    let tillNumber;
    if (role === "CASHIER") {
        tillNumber = await Till.findOne({_id: tillId})

        // If no till found, return an error for invalid till Id
        if (tillNumber == null) {
            throw new AppError("Invalid Till ID. Corresponding till number not found", 401)
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

    const {password:_, ...userWithoutPassword} = newUser

    return userWithoutPassword
}

export const login = async ({email, password}) => {
    if (!email || !password) {
        throw new AppError("Invalid credentials", 400)
    }

    // Look for user
    const user = await User.findOne({email})

    if (user == null || !user) {
        throw new AppError("User not found", 401)
    }

    // compare the passwords if user exists
    const passwordMatch = await bcrypt.compare(password, user.password)

    if (!passwordMatch) {
        throw new AppError("Invalid credentials", 401)
    }

    //TODO: if passwords match return the access and refresh token
    const payload = {id: user._id, email: user.email, role: user.role}
    const accessToken = generateAccessToken(payload)
    const refreshToken = generateRefreshToken(payload)
    return {
        accessToken,
        refreshToken,
        user: {
            id: user._id,
            email: user.email,
            role: user.role,
        },
    };
}

export const updateUserProfile = async ({id, data}) => {
        if (!id) {
            throw new AppError("Missing user id", 400)
        }

        if (!data || typeof data != "object") {
            throw new AppError("Invalid data", 400)
        }

        // developer and admin can update:
        // email, password, role, tillNumber
        const allowedFields = ["email", "password", "role", "tillNumber"]

        // check if frontend has sent valid update data
        const updates = Object.keys(data)
        // validate request updates
        const isValidUpdate = updates.every(field => allowedFields.includes(field))

        if (!isValidUpdate) {
            throw new AppError("You don't have permissions to update some fields", 401)
        }

        const user = await User.findById(id)

        if (!user) {
            throw new AppError("User not found", 404)
        }

        // handle data separately
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

        return `${user.email}'s details have been updated succesfully`
}

export const deleteUser = async ({id}) => {
        if (!id) {
            throw new AppError("Missing user ID", 400)
        }

        const user = await User.findById(id)

        if (!user) {
            throw new AppError("User not found", 404)
        }

        if (user.role === "DEVELOPER" || user.role === "ADMIN") {
            throw new AppError("Cannot delete this user", 400)
        }

        await user.deleteOne()

        return `Account associated with email id: ${user.email} has been deleted permanently`
}

export const getAllUsers = async () => {
        const users = await User.find()

        if (!users) {
            return successResponse(res, null, "No users found", 200)
        }

        return { users }
}

export const getUser = async ({id}) => {
        if(!id){
            throw new AppError("Missing query id", 400)
        }

        const user = await User.findById(id)

        if(!user){
            throw new AppError("User not found", 404)
        }

        const {password:_, ...userWithoutPassword} = user

        return {...userWithoutPassword}
}