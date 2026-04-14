import {Role} from "./role.model.js";
import {Op} from "sequelize";

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
            where: whereCondition
        })

        if (!role) {
            return {ok: false, message: "Failed to fetch role"}
        }

        return {ok: true, message: "Role fetch successfully", data: role}

    } catch (e) {
        return {ok: false, message: "An error occurred while fetching role", errorMessage: e.message}
    }
}