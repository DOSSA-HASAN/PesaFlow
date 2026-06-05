import * as mpesaService from "./mpesa.service.js"
import {errorResponse, successResponse} from "../utils/response.js";
import {NUMBER} from "sequelize";

export const generatePaymentQRCode = async (req, res, next) => {
    try {
        const {shortCode} = req.paymentAccount
        const {RefNo, amount, size} = req.body
        if (!shortCode) {
            return errorResponse(res, `Missing ${process.env.MPESA_SHORTCODE_TYPE} number`, 400)
        }
        if (!amount) {
            return errorResponse(res, "Missing amount. Required for QR code generation")
        }
        const qrCode = await mpesaService.generatePaymentQRCode(shortCode, RefNo, amount, size)
        return successResponse(res, qrCode, "QR code generated successfully", 200)
    } catch (e) {
        next(e)
    }
}

export const registerValidationAndConfirmationUrl = async (req, res, next) => {
    try {
        const {shortCode} = req.paymentAccount

        if (!shortCode) {
            return errorResponse(res, "Short code required to complete URL confirmation and validation")
        }

        // base url for the app / server specific to this function, prod has to be https
        const BASE_APP_URL = "https://localhost:5213/api/mpesa"
        const confirmationUrl = `${BASE_APP_URL}/confirmation`
        const validationUrl = `${BASE_APP_URL}/validation`
        const validationAndConfirmationResponse = await mpesaService.registerValidationAndConfirmationUrl(shortCode, confirmationUrl, validationUrl)
        return successResponse(res, validationAndConfirmationResponse, "Validation and Confirmation URL's set successfully")
    } catch (e) {
        next(e)
    }
}