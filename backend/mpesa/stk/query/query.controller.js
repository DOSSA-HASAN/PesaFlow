import {errorResponse, successResponse} from "../../../utils/response.js";
import * as queryService from "./query.service.js"

export const queryStkTransactionStatus = async (req, res, next) => {
    try {
        const {shortCode} = req.paymentAccount
        const {checkoutRequestId} = req.body
        if(!checkoutRequestId){
            return errorResponse(res, "Missing required fields to query STK transaction status", 400)
        }
        const query = await queryService.queryStkTransactionStatus(shortCode, checkoutRequestId)
        return successResponse(res, query, "STK transaction status fetched successfully", 200)
    } catch (e) {
        next(e)
    }
}