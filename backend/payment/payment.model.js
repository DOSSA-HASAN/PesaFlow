import {sequelize} from "../config/db.js";
import {DataTypes} from "sequelize";

export const Payment = sequelize.define("Payment", {
    id: {
        type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true
    },
    /**
     * Custom payment reference: generate by user or system not from safaricom
     */
    reference: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: false
    },
    type: {
        type: DataTypes.ENUM("C2B", "B2PAYBILL", "B2TILL", "B2POCHI", "B2C", "STK", "REVERSAL"),
        allowNull: false
    },
    idempotencyKey: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM("PENDING", "SUBMITTED", "SUCCESS", "FAILED", "CANCELLED", "TIMEOUT"),
        defaultValue: "PENDING"
    },
    statusHistory: {
        type: DataTypes.ARRAY(DataTypes.JSON),
        required: true,
    },
    amount: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: false
    },
    mpesaTimestamp: {
        type: DataTypes.STRING,
        allowNull: true
    },
    currency: {
        type: DataTypes.ENUM("KES"),
        defaultValue: "KES"
    },
    remarks: {
        type: DataTypes.STRING,
        allowNull: true
    },
    /**
     * Phone number involved in transaction
     */
    phoneNumber: {
        type: DataTypes.STRING,
        allowNull: true
    },

    partyA: {
        type: DataTypes.STRING,
        allowNull: true
    },
    partyB: {
        type: DataTypes.STRING,
        allowNull: true
    },
    /**
     * Mainly for b2b / b2c transaction
     */
    conversationId: {
        type: DataTypes.STRING,
        unique: false,
        allowNull: true
    },
    /**
     * Comes from safaricom
     */
    originatorConversationId: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: true
    },
    /**
     * Mainly for STK push
     */
    checkoutRequestId: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true
    },
    /**
     * Mostly used for STK push
     */
    merchantRequestId: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true
    },
    externalReceiptNumber: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true
    },
    responseCode: {
        type: DataTypes.STRING,
        allowNull: true
    },
    resultCode: {
        type: DataTypes.STRING,
        allowNull: true
    },
    resultDescription: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    /**
     * Payment Description
     */
    description: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    requestPayload: {
        type: DataTypes.JSON,
        allowNull: true
    },
    callbackPayload: {
        type: DataTypes.JSON,
        allowNull: true
    },
    initiatedBy: {
        type: DataTypes.UUID,
        allowNull: false
    },
    isReconciled: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },

    reconciledAt: {
        type: DataTypes.DATE,
        allowNull: true
    },
}, {
    timestamps: true,
    indexes: [
        {fields: ["reference"]},
        {fields: ["type"]},
        {fields: ["status"]},
        {fields: ["conversationId"]},
        {fields: ["checkoutRequestId"]},
        {fields: ["merchantRequestId"]},
        {fields: ["externalReceiptNumber"]},
        {fields: ["idempotencyKey"]},
        {fields: ["originatorConversationId"]},
        {fields: ["checkoutRequestId", "status"]}
    ],
    tableName: "payments"
})