import { sequelize } from "../config/db.js";
import User from "../user/user.model.js";
import { Role } from "../rbac/role/role.model.js";
import { Permission } from "../rbac/permission/permission.model.js";
import {Payment} from "../payment/payment.model.js";
import {PaymentAccount} from "../mpesaAccount/payment_account.model.js";

// Tenant.hasMany(User, {foreignKey: "tenantId", as: "users"})
// User.belongsTo(Tenant, {foreignKey: "tenantId", as: "tenant"})

User.belongsToMany(Role, { through: "UserRoles" })
Role.belongsToMany(User, { through: "UserRoles" })

const RolePermissions = sequelize.define("role_permission", {}, { timestamps: true })

Role.belongsToMany(Permission, { through: RolePermissions })
Permission.belongsToMany(Role, { through: RolePermissions })

Payment.belongsTo(User, {foreignKey: "initiatedBy", as: "initiator"})
Payment.belongsTo(User, {foreignKey: "completedBy", as: "completer"})
User.hasMany(Payment, {foreignKey: "initiatedBy", as: "initiatedPayment"})
User.hasMany(Payment, {foreignKey: "completedBy", as: "completedPayment"})

export { User, Role, Permission, RolePermissions, Payment, PaymentAccount }