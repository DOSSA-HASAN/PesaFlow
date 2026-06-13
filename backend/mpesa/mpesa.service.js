import "dotenv/config.js"
import {AppError} from "../utils/AppError.js";
import {darajaRequest} from "./shared/darajaRequest.js";
import {getTrxCode} from "../utils/getTrxCode.js";
import {getMpesaEnvironmentSpecificValue} from "../utils/getMpesaEnvironmentSpecificValue.js";

const BASE_URL = process.env.MPESA_BASE_URL
const IS_SANDBOX = process.env.MPESA_ENV === "sandbox"

/**
 * Response returned by Safaricom Daraja QR API.
 *
 * @typedef {Object} DarajaQRCodeResponse
 * @property {string} ResponseCode - Daraja response code.
 * @property {string} RequestID - Request tracking identifier.
 * @property {string} ResponseDescription - API response description.
 * @property {string} QRCode - Base64 encoded QR code image.
 */

/**
 * Generates an M-Pesa QR code.
 * Ensures the shortcode exists in the database before generating the QR code.
 *
 * @param {string} shortCode - Business till or paybill number.
 * @param {string} [RefNo="Invoice Test"] - Custom payment reference.
 * @param {number} amount - Payment amount.
 * @param {string} [size="300"] - QR code image size.
 *
 * @returns {Promise<DarajaQRCodeResponse>}
 */
export const generatePaymentQRCode = async (shortCode, RefNo = "Invoice Test", amount, size = "300") => {
    if (Number(amount) === 0) {
        throw new AppError("Amount cannot be 0", 400)
    }
    try {
        const MerchantName = process.env.MERCHANT_NAME.toString()

        const method = "POST"
        const url = `/mpesa/qrcode/v1/generate`
        const data = {
            "MerchantName": MerchantName,
            "RefNo": RefNo,
            "Amount": amount,
            "TrxCode": getTrxCode(),
            "CPI": shortCode,
            "size": size
        }

        const qrCode = await darajaRequest({method, url, data})
        return qrCode
    } catch (e) {
        throw e
    }

}

/**
 * Response returned by Safaricom Daraja Register URL API.
 *
 * @typedef {Object} DarajaRegisterURLResponse
 * @property {string} OriginatorConversationID - Unique request tracking ID.
 * @property {string} ResponseCode - API response code. "0" indicates success.
 * @property {string} ResponseDescription - API response message.
 */

/**
 * Registers C2B validation and confirmation callback URLs for an M-Pesa shortcode.
 *
 * The Customer to Business (C2B) Register URL API enables merchants to receive
 * payment notifications for transactions made to a Paybill or Till number.
 *
 * Registered URLs:
 * - Validation URL: Used to validate transactions before completion.
 * - Confirmation URL: Receives payment notifications after successful payment.
 *
 * Notes:
 * - In production, this is typically a one-time API call per shortcode.
 * - In sandbox, URLs can be overwritten multiple times.
 * - To update production URLs, they must first be deleted from the Daraja
 *   self-service portal or updated through Safaricom support.
 * - Transaction validation is optional and must be activated by Safaricom.
 *
 * @param {string} shortCode - Business Paybill or Till number.
 * @param {string} confirmationUrl - URL that receives successful payment notifications.
 * @param {string} validationUrl - URL used for transaction validation.
 *
 * @returns {Promise<DarajaRegisterURLResponse>}
 */
export const registerValidationAndConfirmationUrl = async (shortCode, confirmationUrl, validationUrl) => {
    const url = "mpesa/c2b/v2/registerurl"
    const method = "POST"
    const data = {
        "ShortCode": shortCode,
        "ResponseType": "Completed",
        "ConfirmationURL": getMpesaEnvironmentSpecificValue("https://mydomain.com/confirmation", confirmationUrl),
        "ValidationURL": getMpesaEnvironmentSpecificValue("https://mydomain.com/validation", validationUrl)
    }
    try {
        const res = await darajaRequest({method, url, data})
        return res

    } catch (e) {
        throw e
    }

}