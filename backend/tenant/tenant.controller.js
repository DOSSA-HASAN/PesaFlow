import * as tenantService from "./tenant.service.js"
import {errorResponse, successResponse} from "../utils/response.js";

export const createTenant = async (req, res) => {
    const {tenantName} = req.body
    try {
        const tenant = await tenantService.createTenant(tenantName)
        return successResponse(res, null,  tenant, 201)
    } catch (e) {
        return errorResponse(res, e.message || "Tenant creation failed", 500, null)
    }
}