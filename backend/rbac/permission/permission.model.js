import {sequelize} from "../config/db.js";
import {DataTypes} from "sequelize";

export const Permission = sequelize.define("Permission", {
    id: {
        type: DataTypes.UUID,
        default: DataTypes.UUIDV4,
        primaryKey: true
    },
    key: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
    }
})