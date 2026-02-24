import mongoose from "mongoose";

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
 * - tillNumber: string, required for cashiers only
 *
 * options:
 * - timestamps: true, automatically adds createdAt and updatedAt fields
 */

const userModel = new mongoose.Schema({
    email: {
        type: String, required: true, unique: true, lowercase: true, trim: true
    }, password: {
        type: String, required: true
    }, role: {
        type: String, enum: ["DEVELOPER", "ADMIN", "ACCOUNTANT", "CASHIER"], default: "CASHIER"
    },
    tillNumber: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Till",
        default: null,
        required: function (){
            return this.role === "CASHIER"
        }
    }

}, {
    timestamps: true
})

const User = mongoose.model("User", userModel)

export default User