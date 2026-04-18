import {Sequelize} from "sequelize";
import {publishEvent} from "../events/publisher.js";

export const sequelize = new Sequelize(process.env.DB_URL, {
    dialect: "postgres", protocol: "postgres", logging: (sql, timingOrOptions) => {
        try {
            publishEvent("SEQUELIZE_LOGS", {
                message: typeof sql === "string" ? sql.slice(0, 1000) : JSON.stringify(sql).slice(0, 1000),
                timing: typeof  timingOrOptions === "number" ? timingOrOptions : null,
                meta: typeof timingOrOptions === "object" ? timingOrOptions : null,
                createdAt: new Date()
            })
            console.log(timingOrOptions)
        } catch (e) {
            console.error(`Log publish failed: ${e.message}`)
        }
    }, dialectOptions: {
        ssl: {
            require: true, rejectUnauthorized: false,
        }
    }
})

export async function connectSQL() {
    try {
        await sequelize.authenticate()
        console.log("Connected to NeonDB ✅")
    } catch (e) {
        console.log(e.message)
    }
}