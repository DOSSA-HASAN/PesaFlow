import * as b2Paybill from "./b2paybill.service.js"
import {errorResponse, successResponse} from "../../utils/response.js";

export const b2paybill = async (req, res, next) => {
    try {
        const {shortCode} = req.paymentAccount
        const {id} = req.user
        const {amount, receiverShortCode, accountRef, idempotencyKey,} = req.body

        if (!shortCode || !amount || amount === "0" || Number(amount) < 0 || !receiverShortCode || receiverShortCode === "" || !idempotencyKey || !accountRef) {
            return errorResponse(res, "Missing required fields to initiate payment", 400)
        }

        const paymentResult = await b2Paybill.b2paybill(amount, shortCode, receiverShortCode, accountRef, idempotencyKey, id)
        return successResponse(res, paymentResult, "Payment request submitted successfully", 200)
    } catch (e) {
        next(e)
    }
}