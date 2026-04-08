import Tenant from "./tenant.model.js";
import {sequelize} from "../config/db.js";
import {AppError} from "../utils/AppError.js";

export const createTenant = async (tenantName) => {

    const dbName = tenantName.toLowerCase().replace(/\s+/g, "_")

    const t = await sequelize.transaction()

    try {
        // Create tenant in main db and encrypt the connection string and store it
        const tenant = await Tenant.create(
            {tenantName, dbName},
            {transaction: t})

        // Create tenant db with the above tenant name
        const tenantDb = await sequelize.query(`CREATE DATABASE ${dbName}`)

        // commit transaction
        await t.commit()
        return `Database created successfully for ${tenantName}: ${dbName}`
    } catch (e) {
        //TODO: USE EVENT PUBLISHING TO log the error to mongodb
        try {
            await t.rollback()
            await sequelize.query(`DROP DATABASE IF EXISTS ${dbName} `)
        } catch (dbError) {
            throw new AppError(dbError.message || `Failed to drop database: ${dbName}`, 500)
        }
        throw new AppError(e.message, 500)

    }
}