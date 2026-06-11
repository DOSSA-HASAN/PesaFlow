// File to query missed stk transactions from callback
import {generateMpesaPassword} from "../../../utils/generateMpesaPassword.js";
import {darajaRequest} from "../../shared/darajaRequest.js";
import {AppError} from "../../../utils/AppError.js";
import {generateTimestamp} from "../../../utils/generateTimestamp.js";

export const queryStkTransactionStatus = async (shortCode, checkoutRequestId) => {
    const method = "POST"
    const url = "mpesa/stkpushquery/v1/query"
    const data = {
        "BusinessShortCode": shortCode,
        "Password": generateMpesaPassword(shortCode),
        "Timestamp": generateTimestamp(),
        "CheckoutRequestID": checkoutRequestId,
    }
    const res = await darajaRequest({method, url, data})
    if (res.ResponseCode !== "0" ) {
        throw new AppError("Failed to get STK transaction status", 400)
    }
    return res
}