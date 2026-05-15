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
            if (accounts.length === 0) {
                return successResponse(res, null, "Payment accounts not found", 200)
            } else {
                return successResponse(res, accounts, "Fetched all payment accounts successfully", 200)
            }
        } else {
            const account = await paymentService.getPaymentAccount(query)
            if (!account) {
                return successResponse(res, null, "Payment account not found", 200)
            } else {
                return successResponse(res, account, "Fetched payment account successfully", 200)
            }
        }
    } catch (e) {
        next(e)
    }
}

export const updatePaymentAccount = async (req, res, next) => {
    try {
        const {id} = req.params
        const data = req.body

        if (!id || !data) {
            throw new AppError("Missing required fields", 400)
        }

        if (data.type) {
            if (data.accountNumber) {
                data.credentialsSecretId = `mpesa/${data.accountNumber}/${data.type}`
            }
        }

        const updatedAccount = await paymentService.updatePaymentAccount(id, data)

        return successResponse(res, updatedAccount, "Payment account details updated successfully", 200)

    } catch (e) {
        next(e)
    }
}

export const blockPaymentAccount = async (req, res, next) => {
    try {
        const {id} = req.params
        if (!id) {
            throw new AppError("Missing id parameter", 400)
        }
        const account = paymentService.blockPaymentAccount(id)
        return successResponse(res, null, typeof account === "string" ? account : "Payment account blocked", 200)
    } catch (e) {
        next(e)
    }
}

export const unblockPaymentAccount = async (req, res, next) => {
    try {
        const {id} = req.params
        if (!id) {
            throw new AppError("Missing id parameter", 400)
        }
        const account = await paymentService.unblockPaymentAccount(id)

        return successResponse(res, null, "Payment account unblocked successfully", 200)
    } catch (e) {
        next(e)
    }
}