import * as permissionService from "./permission.service.js"
import { successResponse } from "../../utils/response.js";

export const addPermission = async (req, res, next) => {
    try {
        const { permission } = req.body
        const createdPermission = await permissionService.addPermission(permission)
        return successResponse(res, createdPermission, "Permission added", 201)
    } catch (e) {
        next(e)
    }
}

export const getAllPermissions = async (req, res, next) => {
    try {
        const permissions = await permissionService.getAllPermissions()
        return successResponse(res, permissions, "Permissions fetched successfully", 200)
    } catch (e) {
        next(e)
    }
}

export const getPermissionById = async (req, res, next) => {
    const { id } = req.params
    try {
        const permission = await permissionService.getPermissionById(id)
        return successResponse(res, permission, "Fetched permission successfully", 200)
    } catch (e) {
        next(e)
    }
}

export const deletePermission = async (req, res, next) => {
    const { id } = req.params
    try {
        await permissionService.deletePermission(id)
        return successResponse(res, null, "Permission deleted successfully", 200)
    } catch (e) {
        next(e)
    }
}

export const updatePermission = async (req, res, next) => {
    const { id } = req.params
    const { permission } = req.body
    if (!permission) {
        throw new AppError("Permission is required", 400)
    }
    try {
        const updatedPermission = await permissionService.updatePermission(id, permission)
        return successResponse(res, updatedPermission, "Permission updated successfully", 200)
    } catch (e) {
        next(e)
    }
}