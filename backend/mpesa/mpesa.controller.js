import * as mpesaService from "./mpesa.service.js"
import {errorResponse, successResponse} from "../utils/response.js";

export const generatePaymentQRCode = async (req, res, next) => {
    try {
        const {shortCode} = req.paymentAccount
        const {RefNo, amount, size} = req.body
        if(!shortCode){
            return errorResponse(res, `Missing ${process.env.MPESA_SHORTCODE_TYPE} number`, 400)
        }
        if(!amount){
            return errorResponse(res, "Missing amount. Required for QR code generation")
        }
        const qrCode = await mpesaService.generatePaymentQRCode(shortCode, RefNo, amount, size)
        return successResponse(res, qrCode, "QR code generated successfully", 200)
    } catch (e) {
        next(e)
    }
}