import { Role } from "./role.model.js";
import { Permission } from "../permission/permission.model.js";
import { sequelize } from "../../config/db.js";
import { AppError } from "../../utils/AppError.js";
import { Op } from "sequelize";

export const addRole = async (roleName) => {
    const role = await Role.findOne({ where: { name: roleName } })

    if (role) {
        throw new AppError("Role already exists", 409)
    }

    const addedRole = await Role.create({ name: roleName })
    return addedRole
}

export const getAllRoles = async () => {
    return await Role.findAll({ include: [{ model: Permission }] })
}

export const getRoleById = async (id) => {
    if (!id) {
        throw new AppError("Missing required ID parameter", 400)
    }
    const role = await Role.findOne({
        where: { id },
        include: Permission
    })

    if (!role) {
        throw new AppError("Role not found", 404)
    }
    return role

}

export const getRoleByName = async (name) => {
    if (!name) {
        throw new AppError("Missing required name parameter", 400)
    }
    const role = await Role.findOne({
        where: { name },
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

    const deletedRole = await Role.destroy({ where: { id } })

    if (deletedRole === 0) {
        throw new AppError("Role not found", 404)
    }

    return true
}

export const updateRole = async (id, name) => {
    const [count, updatedRoles] = await Role.update({ name }, { where: { id }, returning: true })

    if (count === 0) {
        throw new AppError("Role not found", 404)
    }

    const updatedRole = updatedRoles[0]

    return updatedRole
}

export const assignPermission = async (roleId, permissionIds) => {
    const role = await Role.findByPk(roleId)
    if (!role) {
        throw new AppError("No role found", 404)
    }

    const permissions = await Permission.findAll({ where: { id: permissionIds } })
    if (permissionIds.length !== permissions.length) {
        throw new AppError("Some permissions do not exist", 404)
    }
    const t = await sequelize.transaction()
    try {

        await role.setPermissions(permissions, { transaction: t })
        await t.commit()

        // # TODO: blacklist all tokens on redis if using redis for token caching
        return true
    } catch (e) {
        await t.rollback()
        throw e
    }
}