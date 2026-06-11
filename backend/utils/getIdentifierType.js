import "dotenv/config.js"
import {AppError} from "./AppError.js";

const IDENTIFIER_TYPES = {
    BG: "1",
    TILL: "2",
    PB: "4"
}
export const getIdentifierType = (shortcodeType = process.env.MPESA_SHORTCODE_TYPE) => {
    const identifierType = IDENTIFIER_TYPES[shortcodeType]
    if(!identifierType){
        throw new AppError(`Invalid short code identifier type: ${shortcodeType}`)
    }
    return identifierType
}