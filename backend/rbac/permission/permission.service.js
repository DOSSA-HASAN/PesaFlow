import { Permission } from "./permission.model.js";
import { AppError } from "../../utils/AppError.js";
import { where } from "sequelize";

export const addPermission = async (permission) => {
    const res = await Permission.findOne({ where: { key: permission } })

    if (res) {
        throw new AppError("Permission already exists", 409)
    }

    const createdPermission = await Permission.create({ key: permission })
    return createdPermission
}

export const getAllPermissions = async () => {
    return await Permission.findAll()
}

export const getPermissionById = async (id) => {
    if (!id) {
        throw new AppError("Missing ID parameter", 400)
    }
    const permission = await Permission.findByPk(id)
    if (!permission) {
        throw new AppError("Permission not found", 404)
    }
    return permission
}

export const deletePermission = async (id) => {
    if (!id) {
        throw new AppError("Missing ID parameter", 400)
    }
    const permission = await Permission.findByPk(id)

    if (!permission) {
        throw new AppError("Permission not found", 404)
    }

    const count = await permission.destroy()
    if (count === 0) {
        throw new AppError("Permission not found", 404)
    }
    return true
}

export const updatePermission = async (id, newKey) => {
    if (!id || !newKey) {
        throw new AppError("Missing required parameters")
    }
    const permission = await Permission.findByPk(id)
    if (!permission) {
        throw new AppError("Permission not found", 404)
    }

    permission.update({
        where: { id },
        key: newKey
    })
    return permission
}