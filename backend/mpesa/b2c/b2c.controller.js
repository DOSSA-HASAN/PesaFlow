import {errorResponse, successResponse} from "../../utils/response.js";
import * as b2cService from "./b2c.service.js"

export const initiateB2CPayment = async (req, res, next) => {
    try {
        const {shortCode} = req.paymentAccount
        const {id} = req.user
        const {commandId, amount, receiver, remarks, idempotencyKey} = req.body

        if (!shortCode) {
            return errorResponse(res, "Missing short code number", 400)
        }

        if (!id) {
            return errorResponse(res, "Missing current session user ID", 400)
        }

        if (!amount || !receiver || !idempotencyKey) {
            return errorResponse(res, "Missing required fields (amount / receiver number / idempotency key)")
        }
        if (amount === "0" || Number(amount) < 0) {
            return errorResponse("Amount must be greater than 0", 400)
        }

        const b2cPayment = await b2cService.initiateB2CPayment({
            idempotencyKey,
            commandId,
            amount: String(amount),
            shortCode: String(shortCode),
            receiver: String(receiver),
            remarks,
            initiatedBy: id
        })
        return successResponse(res, b2cPayment, "Payment initiated successfully", 200)
    } catch (e) {
        next(e)
    }
}
