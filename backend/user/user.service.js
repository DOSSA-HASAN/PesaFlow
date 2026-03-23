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