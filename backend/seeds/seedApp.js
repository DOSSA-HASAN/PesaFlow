import {getChannel} from "../events/connection.js"
import {publishEvent} from "../events/publisher.js"
import User from "../user/user.model.js"
import {successResponse} from "../utils/response.js"
import bcrypt from "bcryptjs"
import "dotenv/config.js"
import {Role} from "../rbac/role/role.model.js";
import {Permission} from "../rbac/permission/permission.model.js";
import {sequelize} from "../config/db.js";

export const seedApp = async (req, res, next) => {
    try {

        await sequelize.sync({force: true})

        const email = "notyetdoc911@gmail.com"
        const password = await bcrypt.hash("12345", 10) // Less secure password for testing
        const role = "developer"

        const seedUser = await User.create({
            email,
            password,
            permissions: role
        })

        await publishEvent("SEND_EMAIL", {type: "WELCOME MAIL", email: seedUser.email})

        // Create roles
        const cashier = await Role.create({name: "cashier"})
        const accountant = await Role.create({name: "accountant"})
        const admin = await Role.create({name: "admin"})
        const developer = await Role.create({name: "developer"})

        // Assign seedUser with role 'developer'
        seedUser.setRoles([developer])

        // Create user permissions
        const userCreate = await Permission.create({key: "user.create"})
        const userRead = await Permission.create({key: "user.read"})
        const userUpdate = await Permission.create({key: "user.update"})
        const userDelete = await Permission.create({key: "user.delete"})

        // Create role permissions
        const roleCreate = await Permission.create({key: "role.create"})
        const roleRead = await Permission.create({key: "role.read"})
        const roleUpdate = await Permission.create({key: "role.update"})
        const roleDelete = await Permission.create({key: "role.delete"})
        const roleAssign = await Permission.create({key: "role.assign"})

        // Create permission Permissions
        const permissionCreate = await Permission.create({key: "permission.create"})
        const permissionRead = await Permission.create({key: "permission.read"})
        const permissionDelete = await Permission.create({key: "permission.delete"})

        // Create permissions for mpesa payment account operations (PAYBILL / TILL)
        const paymentAccountCreate = await Permission.create({key: "payment.account.create"})
        const paymentAccountView = await Permission.create({key: "payment.account.view"})
        const paymentAccountUpdate = await Permission.create({key: "payment.account.update"})

        // TODO: add more permissions for safcom controllers later

        // TODO: assign roles with permissions
        // assign permission to roles
        const allPermissions = [
            userCreate, userRead, userUpdate, userDelete,
            roleCreate, roleRead, roleUpdate, roleDelete, roleAssign,
            permissionCreate, permissionRead, permissionDelete,
            paymentAccountCreate, paymentAccountView, paymentAccountUpdate
        ]
        developer.setPermissions(allPermissions)
        admin.setPermissions(allPermissions)

    } catch (e) {
        console.error(e.message)
    }
}