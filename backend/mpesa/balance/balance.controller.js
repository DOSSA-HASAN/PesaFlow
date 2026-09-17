import {errorResponse, successResponse} from "../../utils/response.js";
import * as balanceService from "./balance.service.js"

export const getMpesaBalance = async (req, res, next) => {
    try {
        const {shortCode} = req.paymentAccount
        if (!shortCode) {
            return errorResponse(res, "Missing short code", 400)
        }
        const balance = await balanceService.getMpesaBalance(shortCode)
        return successResponse(res, balance, "Balance is being fetched", 200)
    } catch (e){
        next(e)
    }
}