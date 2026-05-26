import "dotenv/config.js"
import {AppError} from "../utils/AppError.js";
import {darajaRequest} from "./shared/darajaRequest.js";
import {generateSecurityCredential} from "./shared/generateSecurityCredentials.js";
import {sequelize} from "../config/db.js";

const BASE_URL = process.env.MPESA_BASE_URL
const IS_SANDBOX = process.env.MPESA_ENV === "sandbox"

/**
 * Generates an M-Pesa QR code.
 * Ensures the shortcode exists in the database before generating QR code
 *
 * @param {string} shortCode - Business till or paybill number
 * @param {string} [RefNo="Invoice Test"] - Custom payment reference
 * @param {number} amount - Payment amount
 * @param {string|number} [size=300] - QR code image size
 * @returns {Promise<*>}
 */
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

    const url = "/mpesa/stkpush/v1/processrequest"
    const method = "POST"
    const data = {
        "BusinessShortCode": Number(shortCode),
        "Password": password,
        "Timestamp": timestamp,
        "TransactionType": IS_SANDBOX ? "CustomerPayBillOnline" : transactionType,
        "Amount": Number(amount),
        "PartyA": customerPhone,
        "PartyB": Number(shortCode),
        "PhoneNumber": customerPhone,
        "CallBackURL": IS_SANDBOX ? "https://mydomain.com/path" : "https://custom.domain.com",
        "AccountReference": accountRef,
        "TransactionDesc": description
    }

    const res = await darajaRequest({method, url, data})
    return res
}

export const initiateB2CPayment = async (commandId, amount, shortCode, receiver, remarks = "remarked", confirmationUrl, timeoutUrl) => {
    const transaction = await sequelize.transaction()
    try{
        const method = "POST"
        const url = "/mpesa/b2c/v3/paymentrequest"
        // const securityCredentials = await generateSecurityCredential()
        const availableCommandIDs = ["SalaryPayment", "BusinessPayment", "PromotionPayment"]
        if(availableCommandIDs.includes(commandId)){
            console.log(availableCommandIDs[commandId])
        }
        const data = {
            "OriginatorConversationID": "85875344f22247dbbebaf505f821387e", // TODO: dynamic
            "InitiatorName": process.env.INITIATOR_NAME,
            "SecurityCredential": "UCyA878pZBwOrYE4idghFh9uhEjy4KqbyvTDI+4MCeg0O3ssv2yzgUlO5iLVETvGOP6YytdGUJui6NwDT7wrtf+3yEvQ6jYdiGNr2b3MPwARf0iHLZiz+B7trstfFmNJBvCwjAtoxcdWkrVsTxHX+RbZeoFjEpq2K2Bxe4+6s/Bp1uIEE1aQq4ltMT+hNmVyyJXowSJrHWfdyXqx5iqNGuY/gPSXv8Wf2yPLdqRrPnSM445tqjlLpnzkrRX6ohB5YCfxIDvWxCOXFt8RWE+2ek/TwHc3+PXKNqEQMuH7W3KpqmjfMzjjhlCNRSPti2VIA1RUaw+KpL8eG9hWc4DqZw==", // TODO: get from mpesa portal
            "CommandID": commandId,
            "Amount": amount,
            "PartyA": shortCode,
            "PartyB": receiver,
            "Remarks": remarks,
            "QueueTimeOutURL": IS_SANDBOX ?  "https://mydomain.com/b2c/queue/" : timeoutUrl,
            "ResultURL": IS_SANDBOX ?  "https://mydomain.com/b2c/result/" : confirmationUrl,
        }

        const res = await darajaRequest({method, url, data})
        // create payment

        await transaction.commit()
        return res
    } catch (e) {
        await transaction.rollback()
        throw e
    }
}