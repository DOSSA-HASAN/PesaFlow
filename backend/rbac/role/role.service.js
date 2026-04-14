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