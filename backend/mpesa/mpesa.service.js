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

export const registerValidationAndConfirmationUrl = async (shortCode, confirmationUrl, validationUrl) => {
    const url = "mpesa/c2b/v2/registerurl"
    const method = "POST"
    const data = {
        "ShortCode": shortCode,
        "ResponseType": "Completed",
        "ConfirmationURL": confirmationUrl,
        "ValidationURL": validationUrl
    }

    const res = await darajaRequest({method, url, data})
    return res
}

export const initiateStkPush = async (shortCode, amount, transactionType, customerPhone, accountRef = "CustPay", description = "CustSTK") => {
    const PASSKEY = process.env.PASSKEY

    const timestamp = new Date()
        .toISOString()
        .replace(/[-T:.Z]/g, "")
        .slice(0, 14);

    const password = Buffer.from(
        shortCode + PASSKEY + timestamp
    ).toString("base64")

    const isSandbox = process.env.MPESA_ENV === "sandbox"

    const url = "/mpesa/stkpush/v1/processrequest"
    const method = "POST"
    const data = {
        "BusinessShortCode": Number(shortCode),
        "Password": password,
        "Timestamp": timestamp,
        "TransactionType": isSandbox ? "CustomerPayBillOnline" : transactionType,
        "Amount": Number(amount),
        "PartyA": customerPhone,
        "PartyB": Number(shortCode),
        "PhoneNumber": customerPhone,
        "CallBackURL": isSandbox ? "https://mydomain.com/path" : "https://custom.domain.com",
        "AccountReference": accountRef,
        "TransactionDesc": description
    }

    const res = await darajaRequest({method, url, data})
    return res
}