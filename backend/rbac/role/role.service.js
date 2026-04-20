import {Role} from "./role.model.js";
import {Permission} from "../permission/permission.model.js";
import {sequelize} from "../../config/db.js";
import {AppError} from "../../utils/AppError.js";

export const addRole = async (roleName) => {
    const role = await Role.findOne({where: {name: roleName}})

    if (role) {
        throw new AppError("Role already exists", 409)
    }

    await Role.create({name: roleName})
}

export const getAllRoles = async () => {
    return await Role.findAll({include: Permission})
}

export const getRoleByIdOrName = async (input) => {
    if (!input) {
        throw new AppError("Missing required ID or input parameter", 400)
    }

    const isId = !isNaN(Number(input))

    const whereCondition = isId ? {id: input} : {name: input}

    const role = await Role.findOne({
        where: whereCondition,
        include: Permission
    })

    if (!role) {
        throw new AppError("Role not found", 404)
    }

    return role
}

export const deleteRole = async (id) => {
    if (!id) {
        throw new AppError("Missing required ID parameter", 400)
    }

    const deletedRole = await Role.destroy({where: {id}})

    if (deletedRole === 0) {
        throw new AppError("Role not found", 404)
    }

    return true
}

export const updateRole = async (id, name) => {
    const [count] = await Role.update({name}, {where: {id}})

    if (count === 0) {
        throw new AppError("Role not found", 404)
    }

    return true
}

export const assignPermission = async (roleId, permissionIds) => {
    const role = await Role.findByPk(roleId)
    if (!role) {
        throw new AppError("No role found", 404)
    }

    const permissions = await Permission.findAll({where: {id: permissionIds}})
    if (permissionIds.length !== permissions.length) {
        throw new AppError("Some permissions do not exist", 404)
    }
    const t = await sequelize.transaction()
    try {

        await role.setPermissions(permissions, {transaction: t})
        await t.commit()

        // # TODO: blacklist all tokens on redis if using redis for token caching
        return true
    } catch (e) {
        await t.rollback()
        throw e
    }
}