import {AppError} from "./AppError.js";

export const generateMpesaPassword = (shortCode) => {
    if(!shortCode){
        throw new AppError("Short code required to generate password")
    }
    const PASSKEY = process.env.PASSKEY
    const timestamp = new Date()
        .toISOString()
        .replace(/[-T:.Z]/g, "")
        .slice(0, 14);
    return Buffer.from(shortCode + PASSKEY + timestamp).toString("base64")
}