import { Sequelize } from "sequelize";
import { publishEvent } from "../events/publisher.js";
import "dotenv/config.js"

export const sequelize = new Sequelize(process.env.DB_URL, {
    dialect: "postgres", protocol: "postgres", dialectOptions: {
        ssl: {
            require: true, rejectUnauthorized: false,
        }
    }
})

export async function connectSQL() {
    try {
        await sequelize.authenticate()
        console.log("Connected to NeonDB ✅")
        await sequelize.sync({ alter: true });
        console.log("Models synced ✅")
    } catch (e) {
        console.log(e.message)
    }
}