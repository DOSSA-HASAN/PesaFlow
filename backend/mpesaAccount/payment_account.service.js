import {PaymentAccount} from "../models/index.js"
import {AppError} from "../utils/AppError.js";
import redisClient from "../utils/redisClient.js";
import {sequelize} from "../config/db.js";

export const addPaymentAccount = async (accountNumber, branchName) => {
    const modBranchName = branchName.trim().toUpperCase().replace(/\s+/g, "")
    const modAccountNumber = accountNumber.toString().trim().replace(/\s+/g, "")
    const exists = await PaymentAccount.findOne({
        where: {shortCode: accountNumber, branchName: modBranchName}
    })

    if (exists) {
        throw new AppError(`Account Number ${accountNumber} already exists.`, 409)
    }

    const businessId = process.env.BUSINESS_ID
    const accountType = process.env.MPESA_SHORTCODE_TYPE.toString().toUpperCase()
    const account = await PaymentAccount.create({
        shortCode: modAccountNumber,
        type: accountType,
        branchName: modBranchName,
        credentialsSecretId: `mpesa/${modAccountNumber}/${accountType}`
    })

    return `Added ${accountType} number ${modAccountNumber} for ${businessId} - ${modBranchName}`
}

export const getAllPaymentAccounts = async () => {
    const accounts = await PaymentAccount.findAll()
    return accounts
}

export const getPaymentAccount = async (q) => {
    const query = {}

    if (q.shortCode) {
        query.shortCode = q.shortCode.toString().trim()
    }
    if (q.branchName) {
        query.branchName = q.branchName.toUpperCase().trim()
    }

    const account = await PaymentAccount.findOne({
        where: query
    })
    return account

}

export const updatePaymentAccount = async (id, data) => {
    /**
     * TODO:
     * if incoming data has secretCredentialsId we need to update aws secret id since its the id we
     * will use to fetch the secret key and consumer key
     **/
    const normalisedData = Object.entries(data).reduce((acc, [key, value]) => {
        acc[key] = typeof value === "string" ?
            value.trim().replace(/\s+/g, "").toUpperCase() :
            value

        return acc
    }, {})
    delete normalisedData.type
    delete normalisedData.isBlocked
    const transaction = await sequelize.transaction()
    try {
        const account = await PaymentAccount.findByPk(id, {transaction})
        if (!account) {
            throw new AppError("Payment account not found", 404)
        }
        await account.update(normalisedData, {transaction})
        await transaction.commit()
        await redisClient.del(`mpesa:payment_account:${account.shortCode}`)
        return account
    } catch (e) {
        await transaction.rollback()
        throw e
    }
}

export const blockPaymentAccount = async (id) => {
    const transaction = await sequelize.transaction()
    try {
        const account = await PaymentAccount.findByPk(id, {transaction})
        if (!account) {
            throw new AppError("Account not found", 404)
        }
        await account.update({"isBlocked": true}, {transaction})
        await transaction.commit()
        await redisClient.del(`mpesa:payment_account:${account.shortCode}`)
        return "Account blocked successfully"
    } catch (e) {
        await transaction.rollback()
        throw e
    }
}

export const unblockPaymentAccount = async (id) => {
    const transaction = await sequelize.transaction()
    try {
        const account = await PaymentAccount.findByPk(id, {transaction})
        if (!account) {
            throw new AppError("Account not found", 404)
        }
        await account.update({"isBlocked": false}, {transaction})
        await transaction.commit()
        await redisClient.del(`mpesa:payment_account:${account.shortCode}`)
        return "Account unblocked successfully"
    } catch (e) {
        await transaction.rollback()
        throw e
    }
}