import User from "./user.model.js";
import bcrypt from "bcryptjs";
import { AppError } from "../utils/AppError.js";
import { generateAccessToken, generateRefreshToken } from "../utils/tokenGenerator.js";
import { Role, Permission } from "../models/index.js";
import { sequelize } from "../config/db.js";

export const createUser = async ({ email, password, roleId }) => {
    // Check if user with email id already exists
    const existingUser = await User.findOne({ where: { email } })

    // Return an error if user with email exists
    if (existingUser) {
        throw new AppError("User with email already exists", 401)
    }

    const role = await Role.findByPk(roleId)
    if (!role) {
        throw new AppError("Role not found", 404)
    }

    const t = await sequelize.transaction()
    try {
        // hash password & create user
        const hashedPassword = await bcrypt.hash(password, 10)
        const newUser = await User.create(
            {
                email,
                password: hashedPassword,
            },
            { transaction: t }
        )

        const assignRole = await newUser.setRoles([role], { transaction: t })

        await t.commit()

        const { password: _, ...userWithoutPassword } = newUser
        return userWithoutPassword

    } catch (error) {
        await t.rollback()
        throw error
    }
    return;
}

export const login = async ({ email, password }) => {
    // Look for user
    const user = await User.findOne({ where: { email }, include: [{ model: Role }] })

    if (user == null || !user) {
        throw new AppError("User not found", 401)
    }

    // compare the passwords if user exists
    const passwordMatch = await bcrypt.compare(password, user.password)

    if (!passwordMatch) {
        throw new AppError("Invalid credentials", 401)
    }

    const roleNames = user.Roles.map(role => role.name)
    const payload = { id: user.id, email: user.email, role: roleNames }
    const accessToken = generateAccessToken(payload)
    const refreshToken = generateRefreshToken(payload)
    return {
        accessToken,
        refreshToken,
        user: {
            id: user._id,
            email: user.email,
            permissions: user.permissions,
        },
    };
}

export const updateUserProfile = async (id, data) => {
    if (!id) {
        throw new AppError("Missing user id", 400)
    }

    if (!data || typeof data != "object") {
        throw new AppError("Invalid data", 400)
    }

    // developer and admin can update:
    // email, password
    const allowedFields = ["email", "password"]

    // check if frontend has sent valid update data
    const updates = Object.keys(data)
    // validate request updates
    const isValidUpdate = updates.every(field => allowedFields.includes(field))

    if (!isValidUpdate) {
        throw new AppError("You don't have permissions to update some fields", 401)
    }

    const user = await User.findByPk(id)

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

    const updatedUser = await user.save()

    return updatedUser
}

export const deleteUser = async (id) => {
    if (!id) {
        throw new AppError("Missing user ID", 400)
    }

    const user = await User.findByPk(id)

    if (!user) {
        throw new AppError("User not found", 404)
    }

    if (user.permissions === "DEVELOPER" || user.permissions === "ADMIN") {
        throw new AppError("Cannot delete this user", 400)
    }

    await user.destroy()

    return true
}

export const getAllUsers = async () => {
    const users = await User.findAll({ attributes: { exclude: ["password"] } })

    if (!users || users.length === 0) {
        throw new AppError("No users found", 404)
    }

    return users
}

export const getUser = async (field) => {
    if (!field) {
        throw new AppError("Missing query ID", 400)
    }

    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field);
    const isUUID = /^[0-9a-fA-F-]{36}$/.test(field);

    if (!isEmail && !isUUID) {
        throw new AppError("Invalid identifier format", 400);
    }

    const whereCondition = isEmail ? { email: field } : { id: field }

    console.log(whereCondition)

    const user = await User.findOne({ where: whereCondition, attributes: { exclude: ["password"] }, include: [{ model: Role, include: [{ model: Permission }] }], })

    if (!user) {
        throw new AppError("User not found", 404)
    }

    return { user }
}

export const setUserRoles = async (userId, roleIds) => {
    const user = await User.findByPk(userId)
    if (!user) {
        throw new AppError("User not found", 404)
    }

    const roles = await Role.findAll({ where: { id: roleIds } })
    const uniqueRoleIds = new Set(roleIds)
    if (roles.length !== uniqueRoleIds.size) {
        throw new AppError("Some roles not found")
    }

    await user.setRoles(roles)
    return true
}