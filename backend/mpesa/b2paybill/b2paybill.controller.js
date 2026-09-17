import * as b2Paybill from "./b2paybill.service.js"
import { errorResponse, successResponse } from "../../utils/response.js";

export const b2paybill = async (req, res, next) => {
    console.log("*****************************************************************************************************************")
    console.log("CONTROLLER B2PAYBILL RUNNING...")
    console.log("*****************************************************************************************************************")
    try {
        const { shortCode } = req.paymentAccount
        const { id } = req.user
        const { amount, receiverShortCode, accountRef, idempotencyKey, remarks } = req.body
        console.log(req.body)

        if (!amount || amount === "0" || Number(amount) < 0) {
            return errorResponse("Amount must be greater than 0", 400)
        }

        if (!shortCode || !receiverShortCode || receiverShortCode === "" || !idempotencyKey || !accountRef) {
            return errorResponse(res, "Missing required fields to initiate payment", 400)
        }

        const paymentResult = await b2Paybill.b2paybill({ amount, shortCode, receiverShortCode, accountRef, idempotencyKey, userId: id, remarks })
        return successResponse(res, paymentResult, "Payment request submitted successfully", 200)
    } catch (e) {
        console.log("*****************************************************************************************************************")
        console.log(`ERROR: ${e.message}`)
        console.log("*****************************************************************************************************************")
        next(e)
    }
}