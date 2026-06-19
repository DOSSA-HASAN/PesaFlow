// File to query missed stk transactions from callback
import {generateMpesaPassword} from "../../../utils/generateMpesaPassword.js";
import {darajaRequest} from "../../shared/darajaRequest.js";
import {AppError} from "../../../utils/AppError.js";
import {generateTimestamp} from "../../../utils/generateTimestamp.js";
import {Payment} from "../../../payment/payment.model.js";

const FINAL_STATES = new Set([
    "SUCCESS", "CANCELLED", "TIMEOUT", "FAILED"
])

export const queryStkTransactionStatus = async (shortCode, checkoutRequestId) => {
    try {

        const payment = await Payment.findOne({where: {"checkoutRequestId": checkoutRequestId}})
        if(!payment){
            throw AppError(`STK transaction with checkout request Id : ${checkoutRequestId} not found`)
        }

        if(FINAL_STATES.has(payment.status)){
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
        const res = await darajaRequest({method, url, data})
        if (!res || res.ResponseCode !== "0") {
            throw new AppError(res?.ResponseDescription ? res?.ResponseDescription : '`Failed to get STK transaction status', 400)
        }

        if (res) {
            await payment.update({
                "resultDescription": res.ResultDesc, "status": res.ResultCode === "0" ? "SUCCESS" : "CANCELLED"
            })

            return payment
        }

    } catch (e) {
        throw new AppError(e.message || "STK query failed", 500)
    }
}