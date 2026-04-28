import User from "../user/user.model.js";
import { Role } from "../rbac/role/role.model.js";
import { Permission } from "../rbac/permission/permission.model.js";
import { sequelize } from "../config/db.js";

// Tenant.hasMany(User, {foreignKey: "tenantId", as: "users"})
// User.belongsTo(Tenant, {foreignKey: "tenantId", as: "tenant"})

User.belongsToMany(Role, { through: "UserRoles" })
Role.belongsToMany(User, { through: "UserRoles" })

const RolePermissions = sequelize.define("RolePermission", {}, { timestamps: true })

Role.belongsToMany(Permission, { through: RolePermissions })
Permission.belongsToMany(Role, { through: RolePermissions })

export { User, Role, Permission, RolePermissions }