import * as permissionService from "./permission.service.js"
import {errorResponse, successResponse} from "../utils/response.js";

export const addPermission = async (req, res) => {
    try {
        const {permission} = req.body
        const response = await permissionService.addPermission(permission)
        if (!response.ok) {
            return errorResponse(res, response || "Permision not added")
        }
        return successResponse(res, null, response || "Permission added", 201)
    } catch (e) {
        return errorResponse(res, e.message || "Failed to add permission", 500)
    }
}

export const getAllPermissions = async (req, res) => {
    try {
        const permissions = await permissionService.getAllPermissions()
        if (!permissions.ok) {
            return errorResponse(res, permissions.message, 404)
        }
        return successResponse(res, permissions.data, permissions.message || "Permissions fetched successfully")
    } catch (e) {
        return errorResponse(res, e.message || "Failed to fetch permissions", 500)
    }
}

export const getPermissionById = async (req, res) => {
    const {id} = req.params
    try {
        if (!id) return errorResponse(res, "Missing ID param", 400)

        const permission = await permissionService.getPermissionById(id)
        if (!permission.ok) {
            return errorResponse(res, permission.message || "Failed to fetch permission", 400)
        }

        return successResponse(res, permission.data, permission.message || "Fetched permission successfully", 201)
    } catch (e) {
        return errorResponse(res, e.message, 500)
    }
}