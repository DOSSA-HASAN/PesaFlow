import {Permission} from "./permission.model.js";
import {AppError} from "../utils/AppError.js";

export const addPermission = async (permission) => {
    // check if db has this permission
    const response = await Permission.findOne({key: permission})

    if (permission) {
        return AppError("Permission already exists", 409)
    }

    await Permission.create(permission)
    return `Permission: ${permission} added`
}

export const getAllPermissions = async () => {
    const permissions = await Permission.findAll()
    return {ok: true, data: permissions}
}

export const getPermissionById = async (id) => {
    const permission = await Permission.findByPk(id)
    if (!permission) {
        return {ok: false, message: "Permission not found"}
    }
    return {ok: true, data: permission}
}

export const deletPermission = async (id) => {
    const permission = await Permission.findByPk(id)

    if (!permission) {
        return {ok: false, message: "Permission not found"}
    }

    await permission.destroy()
    return {ok: true, message: "Permission deleted"}
}

export const updatePermission = async (id, newKey) => {
    const permission = await Permission.findByPk(id)
    if (!permission) {
        return {ok: false, message: "Permission not found"}
    }

    permission.key = newKey
    await permission.save()

    return {ok: true, message: "Permission updated"}

}