import * as b2PochiService from "./b2Pochi.service.js"
import { successResponse } from "../../utils/response.js";

export const b2Pochi = async (req, res, next) => {
    console.log("*******************************************************************")
    console.log("B2Pochi controller running")
    console.log("*******************************************************************")
    try {
        const { shortCode } = req.paymentAccount
        const { id } = req.user
        const { amount, reciever, remarks, reference, idempotencyKey } = req.body
        console.log(amount, reciever, remarks, reference, idempotencyKey)
        const payment = await b2PochiService.b2Pochi({ amount, shortCode, reciever, remarks, reference, idempotencyKey, userId: id })
        return successResponse(res, payment, "Payment request submitted successfully", 200)
    } catch (e) {
        next(e)
    }
}