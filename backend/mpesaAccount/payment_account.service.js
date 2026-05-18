import PaymentAccount from "./payment_account.model.js";
import {AppError} from "../utils/AppError.js";

export const addPaymentAccount = async (accountNumber, branchName) => {
    const modBranchName = branchName.toString().trim().toUpperCase()

    const exists = await PaymentAccount.findOne({
        where: {accountNumber, branchName: modBranchName}
    })

    if (exists) {
        throw new AppError(`Account Number ${accountNumber} already exists.`, 409)
    }

    const businessId = process.env.BUSINESS_ID
    const accountType = process.env.MPESA_SHORTCODE_TYPE.toString().toUpperCase()
    const account = await PaymentAccount.create({
        accountNumber,
        type:accountType,
        branchName: modBranchName,
        credentialsSecretId: `mpesa/${accountNumber}/${accountType}`
    })

    return `Added ${accountType} number ${accountNumber} for ${businessId} - ${branchName}`
}

export const getAllPaymentAccounts = async () => {
    const accounts = await PaymentAccount.findAll()
    return accounts
}

export const getPaymentAccount = async (q) => {
    const query = {}

    if (q.accountNumber) {
        query.accountNumber = q.accountNumber.toString().trim()
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
    const normalisedData = Object.keys(data).map(([key, value]) => {
        if (typeof value === "string"){
            return [
                key,
                value.trim().toUpperCase()
            ]
        }
        return [key, value]
    })
    const [account] = await PaymentAccount.update(
        normalisedData,
        {
            where: {id}
        }
    )

    if (account === 0) {
        throw new AppError("Update failed. Ensure payment account exists", 404)
    }

    return account
}

export const blockPaymentAccount = async (id) => {
    const [account] = await PaymentAccount.update(
        {isBlocked: true},
        {
            where: {id}
        }
    )
    if (account === 0) {
        throw new AppError("Account not found", 404)
    }
    return "Account blocked successfully"
}

export const unblockPaymentAccount = async (id) => {
    const [account] = await PaymentAccount.update(
        {isBlocked: false},
        {
            where: {id}
        }
    )

    if (account === 0) {
        throw new AppError("Account not found", 404)
    }

    return account
}