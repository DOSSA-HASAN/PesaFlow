import mongoose from "mongoose";
import { sequelize } from "../config/db.js";
import { DataTypes } from "sequelize";
import { AppError } from "../utils/AppError.js";

/**
 * @file user.model.js
 * @description Mongoose schema and model for users in the PesaFlow app.
 *              Includes email, password, role, tillNumber and timestamps.
 *              Roles are restricted by an enum: DEVELOPER, ADMIN, ACCOUNTANT, CASHIER
 */

/**
 * User Schema
 * Fields:
 * - email: string, required, unique, lowercase, trimmed
 * - password: string, required, hashed (in controller function)
 * - role: string, enum restricted to: ["DEVELOPER", "ADMIN", "ACCOUNTANT", "CASHIER"]
 * - tillNumber: string
 *
 * options:
 * - timestamps: true, automatically adds createdAt and updatedAt fields
 */

const User = sequelize.define("User", {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        set(value) {
            this.setDataValue("email", value.toLowerCase().trim())
        },
        validate: {
            isEmail: true,
            notEmpty: true
        }
    }, password: {
        type: DataTypes.STRING,
        notNull: true
    }, permissions: {
        type: DataTypes.ENUM("cashier", "accountant", "admin", "developer"),
        defaultValue: "cashier"
    },
    // tillId: {
    //     type: DataTypes.UUID,
    //     allowNull: true,
    // },
    // tenantId: {
    //     type: DataTypes.UUID,
    //     allowNull: false,
    //     table: "tenant"
    // }

}, {
    timestamps: true,
    tableName: "users",

    indexes: [
        {
            unique: true,
            fields: ["email"]
        },
    ],

    // validate: {
    //     cashierMustHaveTill(){
    //         if(this.role === "cashier"){
    //             throw AppError("This permission must have a till id")
    //         }
    //     }
    // }
})

export default User