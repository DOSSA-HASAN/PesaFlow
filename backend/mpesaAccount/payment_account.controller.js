import * as paymentService from "./payment_account.service.js"
import {successResponse} from "../utils/response.js";
import {AppError} from "../utils/AppError.js";

export const addPaymentAccount = async (req, res, next) => {
    try {
        const {accountNumber, type, branch} = req.body
        if (!accountNumber || !type || !branch) {
            throw new AppError("Missing required fields (account number / account type / branch)", 400)
        }

        const account = await paymentService.addPaymentAccount(accountNumber, type, branch)
        return successResponse(res, null, account, 201)
    } catch (e) {
        next(e)
    }
}

export const getAllPaymentAccounts = async (req, res, next) => {
    try {
        const query = req.query
        if (Object.keys(query).length === 0) {
            const accounts = await paymentService.getAllPaymentAccounts()
            return successResponse(res, accounts, "Fetched all payment accounts successfully", 200)
        } else {
            const account = await paymentService.getPaymentAccount(query)
            return successResponse(res, account, "Fetched payment account successfully", 200)
        }
    } catch (e) {
        next(e)
    }
}