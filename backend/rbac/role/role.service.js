import {Role} from "./role.model.js";
import {Permission} from "../permission/permission.model.js";

export const addRole = async (roleName) => {
    try {
        const role = await Role.findOne({where: {name: roleName}})

        if (role) {
            return {ok: false, message: "Permission already exists"}
        }

        await Role.create({name: roleName})
        return {ok: true, message: "Role created successfully"}
    } catch (e) {
        return {ok: false, message: e.message || "Failed to created role"}
    }
}

export const getAllRoles = async () => {
    try {
        const roles = await Roles.findAll({include: Permission})
        if (!roles) {
            return {ok: false, message: "Failed to fetch roles"}
        }
        return {ok: true, message: "Roles fetch successfully", data: roles}
    } catch (e) {
        return {ok: false, message: "An error occurred while fetching roles"}
    }
}

export const getRoleByIdOrName = async (input) => {
    try {
        if (!input) {
            return {ok: false, message: "Missing required ID or input parameter"}
        }

        const whereCondition = isNaN(input) ? {name: input} : {id: input}

        const role = await Role.findOne({
            where: whereCondition,
            include: Permission
        })

        if (!role) {
            return {ok: false, message: "Failed to fetch role"}
        }

        return {ok: true, message: "Role fetch successfully", data: role}

    } catch (e) {
        return {ok: false, message: "An error occurred while fetching role", errorMessage: e.message}
    }
}

export const deleteRole = async (id) => {
    try {
        if (!id) {
            return {ok: false, message: "Missing required ID parameter"}
        }

        const deletedRole = await Role.destroy({where: {id}})

        if (deletedRole === 0) {
            return {ok: false, message: "Failed to delete role"}
        }

        return {ok: true, message: "Role deleted successfully"}

    } catch (e) {
        return {ok: false, message: "An error occurred while deleting role", errorMessage: e.message}
    }
}

export const updateRole = async (id, name) => {
    try {
        if (!id) {
            return {ok: false, message: "Missing required ID parameter"}
        }
        if (!name) {
            return {ok: false, message: "Missing required name parameter"}
        }
        const [count] = await Role.update({name}, {where: {id}})

        if (count === 0) {
            return {ok: false, message: "Role not found"}
        }

        return {ok: true, message: "Role updated successfully"}

    } catch (e) {
        return {ok: false, message: "An error occurred while updating role", errorMessage: e.message}
    }
}

export const assignPermission = async (roleId, permissionIds) => {
    try {
        if (!roleId || !Array.isArray(permissionIds) || permissionIds.length === 0) {
            return {ok: false, message: "Missing required role or permission ID"}
        }

        const role = await Role.findByPk(roleId)

        if (!role) {
            return {ok: false, message: "No role found"}
        }

        await role.setPermissions(permissionIds)

        return {ok: true, message: "Role permissions updated successfully, ask all users to log out and login again"}
    } catch (e) {
        return {ok: false, message: "An error occurred while assigning permissions to role", errorMessage: e.message}
    }
}