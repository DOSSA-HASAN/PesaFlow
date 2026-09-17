import {Sequelize} from "sequelize";
import "dotenv/config.js"

export const sequelize = new Sequelize(process.env.DB_URL, {
    dialect: "postgres", protocol: "postgres", dialectOptions: {
        // ssl: {
        //     require: true, rejectUnauthorized: false,
        // },
        connectTimeout: 60000,
        pool: {
            max: 5,         // Reduce max connections in dev so you don't choke Postgres
            min: 0,
            acquire: 60000, // Maximum time (ms) pool will try to get connection before throwing error
            idle: 10000     // Time (ms) a connection can be idle before being released
        }
    }
})

export async function connectSQL() {
    try {
        await sequelize.authenticate()
        await sequelize.sync({force:true})
        console.log("Connected to NeonDB ✅")
        // console.log("Models synced ✅")
    } catch (e) {
        console.error(e)
        throw e
    }
}

// Ensure you have access to your sequelize instance
const gracefulShutdown = async (signal) => {
    console.log(`Received ${signal}. Closing Sequelize connections...`);
    try {
        await sequelize.close();
        console.log('Sequelize connections closed cleanly.');
        process.exit(0);
    } catch (error) {
        console.error('Error closing Sequelize connections:', error);
        process.exit(1);
    }
};

// Listen for termination signals from nodemon / system
process.on('SIGINT', () => gracefulShutdown('SIGINT'));
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));

// Nodemon specifically uses SIGUSR2 to signal a restart
process.once('SIGUSR2', async () => {
    try {
        await sequelize.close();
        console.log('Sequelize closed via Nodemon restart.');
        process.kill(process.pid, 'SIGUSR2');
    } catch (error) {
        process.exit(1);
    }
});