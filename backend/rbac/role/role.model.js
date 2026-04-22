import {sequelize} from "../../config/db.js";
import {DataTypes} from "sequelize";

export const Role = sequelize.define("Role", {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        unique: true
    }
})