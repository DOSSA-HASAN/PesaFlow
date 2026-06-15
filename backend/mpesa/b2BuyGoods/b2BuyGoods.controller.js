import * as b2BuyGoodsService from "./b2BuyGoods.service.js"
import {successResponse} from "../../utils/response.js";

export const b2BuyGoods = async (req, res, next) => {
    try {
        const {shortCode} = req.paymentAccount
        const {id} = req.user
        const {amount, recieverShortCode, accountReference, remarks, idempotencyKey} = req.body
        const paymentResponse = await b2BuyGoodsService.b2BuyGoods(amount, shortCode, recieverShortCode, accountReference, remarks, idempotencyKey, id)
        return successResponse(res, paymentResponse, "Payment request submitted successfully", 200)
    } catch (e) {
        next(e)
    }
}