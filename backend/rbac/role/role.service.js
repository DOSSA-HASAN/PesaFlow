import {Role} from "./role.model.js";

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
        const roles = await Roles.findAll()
        if (!roles) {
            return {ok: false, message: "Failed to fetch roles"}
        }
        return {ok: true, message: "Roles fetch successfully", data: roles}
    } catch (e) {
        return {ok:false, message: "An error occurred while fetching roles"}
    }
}