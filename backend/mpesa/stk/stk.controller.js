import {errorResponse, successResponse} from "../../utils/response.js";
import * as stkService from "./stk.service.js"

export const initiateStkPush = async (req, res, next) => {
    try {
        console.log(req.body)
        const {shortCode} = req.paymentAccount
        const {id} = req.user
        if(!shortCode){
            return errorResponse(res, "Missing short code", 400)
        }
        const {amount, customerPhone, accountRef, description, idempotencyKey} = req.body
        if(!amount || !customerPhone || !idempotencyKey){
            return errorResponse(res, "Missing required fields", 400)
        }
        if(amount <= 0){
            return  errorResponse(res, "Amount needs to be greater than 0", 400)
        }
        // Check phone number format
        const phoneRegex = /^2547\d{8}$/;
        const isValidCustomerPhone = phoneRegex.test(customerPhone);
        if (!isValidCustomerPhone) {
            return errorResponse(res, "Invalid phone number format. Use 2547XXXXXXXX", 400);
        }
        const transactionType = process.env.MPESA_SHORTCODE_TYPE.toString() === "BG" ? "CustomerBuyGoodsOnline" : "CustomerPayBillOnline"
        const stkPushResponse = await stkService.initiateStkPush(shortCode, amount, transactionType, customerPhone, accountRef, description, idempotencyKey, id)
        return successResponse(res, stkPushResponse, `Prompt sent to ${customerPhone}`)
    } catch (e) {
        next(e)
    }
}
