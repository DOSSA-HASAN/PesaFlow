import mongoose from "mongoose";
import {sequelize} from "../config/db.js";
import {DataTypes} from "sequelize";

const Till = sequelize.define("Till", {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        tillNumber: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false
        },
        branchName: {
            type: DataTypes.STRING,
            allowNull: false
        }
    },
    {
        timestamps: true,
        indexes: [
            {
                unique: true,
                fields: ["tillNumber", "branchName"]
            }
        ],
        tableName: "till"
    }
)

export default Till