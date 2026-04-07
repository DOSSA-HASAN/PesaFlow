import mongoose from "mongoose";

const logSchema = new mongoose.Schema({
    tenantId: String,
    message: String,
    date: {
        type: Date,
        default: Date.now
    }
})

const Log = mongoose.model("Log", logSchema)

export const mongoLogger = async (tenantId, message) => {
    await Log.create({
        tenantId,
        message
    })
}