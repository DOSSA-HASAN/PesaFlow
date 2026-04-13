import mongoose from "mongoose";
import {AppError} from "./AppError.js";

const logSchema = new mongoose.Schema({
    message: String,
    timing: Number,
    meta: {
        type: Object,
        default: {}
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

export const Log = mongoose.model("Log", logSchema)