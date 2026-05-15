import {sequelize} from "../config/db.js";
import {DataTypes} from "sequelize";

const payment_account = sequelize.define("PaymentAccount", {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        accountNumber: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false
        },
        branchName: {
            type: DataTypes.STRING,
            allowNull: false,
            set(value){
                this.setDataValue("branchName", value?.toUpperCase())
            }
        },
        type: {
            type: DataTypes.ENUM("PAYBILL", "TILL"),
            allowNull: false,
            set(value){
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
            allowNull: true
        }
    },
    {
        timestamps: true,
        indexes: [
            {
                unique: true,
                fields: ["accountNumber", "branchName"]
            }
        ],
        tableName: "payment_account"
    }
)


export default payment_account