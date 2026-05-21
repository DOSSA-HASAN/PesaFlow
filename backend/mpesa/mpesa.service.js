import "dotenv/config.js"
import {AppError} from "../utils/AppError.js";
import {darajaRequest} from "./shared/darajaRequest.js";

const BASE_URL = process.env.MPESA_BASE_URL

export const generatePaymentQRCode = async (shortCode, RefNo = "Invoice Test", amount, size = "300") => {
    if (Number(amount) === 0) {
        throw new AppError("Amount cannot be 0", 400)
    }
    try {
        const MerchantName = process.env.MERCHANT_NAME.toString()
        const TrxCode = process.env.MPESA_SHORTCODE_TYPE.toString()
        if (!shortCode) {
            throw new AppError(`Missing ${TrxCode.toString().toLowerCase()}`, 400)
        }

        const method = "POST"
        const url = `/mpesa/qrcode/v1/generate`
        const data = {
            MerchantName,
            RefNo,
            Amount: Number(amount),
            TrxCode,
            CPI: shortCode,
            size
        }

        const qrCode = await darajaRequest({method, url, data})
        console.log(`QRCODE: ${JSON.stringify(qrCode)}`)
        return qrCode
    } catch (e) {
        throw e
    }

}