import * as roleService from "./role.service.js"
import {errorResponse, successResponse} from "../../utils/response.js";
import {AppError} from "../../utils/AppError.js";

export const addRole = async (req, res, next) => {
    try {
        const {roleName} = req.body
        if (!roleName) {
            throw new AppError("Missing required role field", 400)
        }

        await roleService.addRole(roleName)

        return successResponse(res, null, "Role created successfully", 201)
    } catch (e) {
        next(e)
    }
}

export const getAllRoles = async (req, res, next) => {
    try {
        const roles = await roleService.getAllRoles()
        return successResponse(res, roles, "Roles fetched successfully", 200)
    } catch (e) {
        next(e)
    }
}

export const getRoleByIdOrName = async (req, res, next) => {
    try {
        const {field} = req.params

        await roleService.getRoleByIdOrName(field)

        return successResponse(res, role, "Role fetched successfully", 200)

    } catch (e) {
        next(e)
    }
}

export const deleteRole = async (req, res, next) => {
    try {
        const {id} = req.params
        const role = await roleService.deleteRole(id)
        return successResponse(res, null, "Role deleted successfully", 200)
    } catch (e) {
        next(e)
    }
}