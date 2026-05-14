// Func to get all till numbers
// Func to update till number
// Func to delete till number
// Func to get specific till Number
// Func to add till number

import PaymentAccount from "./payment_account.model.js";
import {AppError} from "../utils/AppError.js";

export const addPaymentAccount = async (accountNumber, type, branchName) => {
    if (type !== "PAYBILL" && type !== "TILL") {
        throw new AppError("Account type can only be 'PAYBILL' or 'TILL'", 409)
    }

    const modBranchName = branchName.toString().trim().toLowerCase()

    const exists = await PaymentAccount.findOne({
        where: {accountNumber, branchName: modBranchName}
    })

    if (exists) {
        throw new AppError(`Account Number ${accountNumber} already exists.`, 409)
    }

    const businessId = process.env.BUSINESS_ID

    const account = await PaymentAccount.create({
        accountNumber,
        type,
        branchName: modBranchName,
        credentialsSecretId: `mpesa/${accountNumber}/${type}`
    })

    return `Added ${type} number ${accountNumber} for ${businessId} - ${branchName}`
}

export const getAllPaymentAccounts = async () => {
    const accounts = await PaymentAccount.findAll()
    return accounts
}

export const getPaymentAccount = async (q) => {
    // type
    // accountNumber
    // branchName

    const query = {}

    if(q.type){
        query.type = q.type
    }
    if(q.accountNumber){
        query.accountNumber = q.accountNumber
    }
    if(q.branchName){
        query.branchName = q.branchName
    }

    console.log(query)

    const account = await PaymentAccount.findOne({
        where: query
    })

    return account
}