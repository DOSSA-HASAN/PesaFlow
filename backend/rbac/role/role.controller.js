import * as roleService from "./role.service.js"
import {errorResponse, successResponse} from "../../utils/response.js";

export const addRole = async (req, res) => {
    try {
        const {roleName} = req.body
        if (!roleName) {
            return errorResponse(res, "Missing required role field", 400)
        }

        const role = await roleService.addRole(roleName)
        if (!role.ok) {
            return errorResponse(res, role.message || "Failed to add role", 400)
        }

        return successResponse(res, null, role.message || "Role create successfully", 201)
    } catch (e) {
        console.error(`An error occurred while adding a role: ${e.message}`)
        return errorResponse(res, e.message || "Internal Server Error", e.statusCode || 500)
    }
}