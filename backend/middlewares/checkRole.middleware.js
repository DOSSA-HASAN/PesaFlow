import { Permission } from "../rbac/permission/permission.model.js";
import User from "../user/user.model.js";
import { errorResponse } from "../utils/response.js";

/**
 *
 * @param requiredPermission an array that includes the permissions for each route
 */
export const authorize = (requiredPermission) => {
    return async (req, res, next) => {
        const user = req.user
        const userRoles = user.role || await user.getRoles({ include: [{ model: Permission }] })

        const userPermissions = userRoles.flatMap(role => role.Permissions.map(permission => permission.key))

        if (!userPermissions.includes(requiredPermission)) {
            return errorResponse(res, "you do not have this permission", 403)
        }
        next()
    }
}