import {getChannel} from "../events/connection.js"
import {publishEvent} from "../events/publisher.js"
import User from "../user/user.model.js"
import {successResponse} from "../utils/response.js"
import bcrypt from "bcryptjs"
import "dotenv/config.js"
import {Role} from "../models/index.js";
import {Permission} from "../models/index.js";
import {sequelize} from "../config/db.js";
import {PaymentAccount} from "../models/index.js";

export const seedApp = async (req, res, next) => {
    try {

        await sequelize.sync({force: true})

        // Define password for seed users
        const password = await bcrypt.hash("12345", 10)

        const seedDeveloperUser = await User.create({
            email: "dev@gmail.com",
            password: password,
        })

        const seedAccountantUser = await User.create({
            email: "account@gmail.com",
            password: password,
        })

        const seedCashierUser = await User.create({
            email: "cashier@gmail.com",
            password: password,
        })

        const seedAdminUser = await User.create({
            email: "admin@gmail.com",
            password: password,
        })

        // await publishEvent("SEND_EMAIL", {type: "WELCOME MAIL", email: seedUser.email})

        // Create roles
        const cashier = await Role.create({name: "cashier"})
        const accountant = await Role.create({name: "accountant"})
        const admin = await Role.create({name: "admin"})
        const developer = await Role.create({name: "developer"})

        // Assign seedUser with role 'developer'
        seedDeveloperUser.setRoles([developer])
        seedAccountantUser.setRoles([accountant])
        seedCashierUser.setRoles([cashier])
        seedAdminUser.setRoles([admin])

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

        // Add permissions for mpesa payments
        const mpesaGenerateQrCode = await Permission.create({key: "mpesa.qrcode.generate"})
        const mpesaInitiateStkPush = await Permission.create({key: "mpesa.stk.initiate"})
        const mpesaInitiateb2c = await Permission.create({key: "mpesa.b2c.initiate"})
        const mpesaInitiateb2b = await Permission.create({key: "mpesa.b2b.initiate"})

        // Add payment permissions
        const paymentView = await Permission.create({key: "transaction.view"})

        // assign all permissions to admin
        const adminPermissions = [
            userCreate, userRead, userUpdate, userDelete,
            roleCreate, roleRead, roleUpdate, roleDelete, roleAssign,
            permissionCreate, permissionRead, permissionDelete,
            paymentAccountCreate, paymentAccountView, paymentAccountUpdate,
            mpesaGenerateQrCode, mpesaInitiateStkPush, mpesaInitiateb2c, mpesaInitiateb2b,
            paymentView
        ]

        const developerPermissions = [
            userCreate, userRead, userUpdate, userDelete,
            roleCreate, roleRead, roleUpdate, roleDelete, roleAssign,
            permissionCreate, permissionRead, permissionDelete,
            paymentAccountCreate, paymentAccountView, paymentAccountUpdate,
            paymentView
        ]

        const accountantPermissions = [
            mpesaGenerateQrCode, mpesaInitiateStkPush, mpesaInitiateb2c, mpesaInitiateb2b,
            paymentView
        ]

        const cashierPermissions = [
            mpesaGenerateQrCode, mpesaInitiateStkPush,
            paymentView
        ]

        developer.setPermissions(developerPermissions)
        admin.setPermissions(adminPermissions)
        accountant.setPermissions(accountantPermissions)
        cashier.setPermissions(cashierPermissions)

        // Add shortcodes
        await PaymentAccount.create({
            accountNumber: "174379",
            branch: "westlands - 1"
        })

        await PaymentAccount.create({
            accountNumber: "600979",
            branch: "westlands - 2"
        })


    } catch (e) {
        console.error(e.message)
    }
}