import {sequelize} from "../config/db.js";
import {DataTypes} from "sequelize";

const PaymentAccount = sequelize.define("PaymentAccount", {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        shortCode: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false
        },
        branchName: {
            type: DataTypes.STRING,
            allowNull: false,
            set(value) {
                this.setDataValue("branchName", value?.toUpperCase())
            }
        },
        type: {
            type: DataTypes.ENUM("BG", "TILL"),
            allowNull: false,
            set(value) {
                this.setDataValue("type", value?.toUpperCase())
            }
        },
        credentialsSecretId: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        isBlocked: {
            type: DataTypes.BOOLEAN,
            allowNull: true,
            defaultValue: false
        }
    },
    {
        timestamps: true,
        indexes: [
            {
                unique: true,
                fields: ["shortCode", "branchName"]
            }
        ],
        tableName: "PaymentAccount"
    }
)


export default PaymentAccount