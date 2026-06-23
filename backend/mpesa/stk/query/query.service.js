// File to query missed stk transactions from callback
import {generateMpesaPassword} from "../../../utils/generateMpesaPassword.js";
import {darajaRequest} from "../../shared/darajaRequest.js";
import {AppError} from "../../../utils/AppError.js";
import {generateTimestamp} from "../../../utils/generateTimestamp.js";
import {Payment} from "../../../payment/payment.model.js";
import {addStatusHistory} from "../../../utils/addStatusHistory.js";

const FINAL_STATES = new Set(["SUCCESS", "CANCELLED", "TIMEOUT", "FAILED"])

const mapStatus = (code) => {
    switch (String(code)) {
        case "0":
            return "SUCCESS"
        case "1032":
            return "CANCELLED"
        case "1037":
            return "TIMEOUT"
        default:
            return "FAILED"
    }
}

export const queryStkTransactionStatus = async (shortCode, checkoutRequestId) => {

    const payment = await Payment.findOne({where: {"checkoutRequestId": checkoutRequestId}})
    if (!payment) {
        throw new AppError(`STK transaction with checkout request Id : ${checkoutRequestId} not found`, 404)
    }

    if (FINAL_STATES.has(payment.status)) {
        return payment
    }

    const method = "POST"
    const url = "/mpesa/stkpushquery/v1/query"
    const data = {
        "BusinessShortCode": shortCode,
        "Password": generateMpesaPassword(shortCode),
        "Timestamp": generateTimestamp(),
        "CheckoutRequestID": checkoutRequestId,
    }
    try {
        const res = await darajaRequest({method, url, data})
        if (!res || res.ResponseCode !== "0" && Number(res.ResponseCode) !== 0) {
            throw new AppError(res?.ResponseDescription ? res?.ResponseDescription : '`Failed to get STK transaction status', 400)
        }

        await payment.update({
            "resultDescription": res.ResultDesc,
            "status": mapStatus(res.ResultCode),
            statusHistory: addStatusHistory(payment, mapStatus(res.ResultCode))
        })

        return payment
    } catch (e) {
        throw new AppError(`An error occurred while querying STK status: ${e.message}`, 500)
    }
}