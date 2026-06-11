import {errorResponse, successResponse} from "../../utils/response.js";
import * as transactionStatusService from "./transactionStatus.service.js"

export const getTransactionStatus = async (req, res, next) => {
    try {
        const {shortCode} = req.paymentAccount
        const {mpesaReceiptNumber, originalConversationId} = req.body
        if (!mpesaReceiptNumber || !originalConversationId) {
            return errorResponse(res, "Missing required fields (Mpesa Receipt Number | Original Conversation Id)", 400)
        }
        const balance = await transactionStatusService.getTransactionStatus(mpesaReceiptNumber, originalConversationId, shortCode)
        return successResponse(res, balance, "Fetched transaction status successfully", 200)
    } catch (e) {
        console.log(e.response?.data)
        next(e)
    }
}