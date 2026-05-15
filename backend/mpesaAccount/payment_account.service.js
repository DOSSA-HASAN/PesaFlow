import PaymentAccount from "./payment_account.model.js";
import {AppError} from "../utils/AppError.js";

export const addPaymentAccount = async (accountNumber, type, branchName) => {
    if (type.toUpperCase() !== "PAYBILL" && type.toUpperCase() !== "TILL") {
        throw new AppError("Account type can only be 'PAYBILL' or 'TILL'", 409)
    }

    const modBranchName = branchName.toString().trim().toUpperCase()

    const exists = await PaymentAccount.findOne({
        where: {accountNumber, branchName: modBranchName}
    })

    if (exists) {
        throw new AppError(`Account Number ${accountNumber} already exists.`, 409)
    }

    const businessId = process.env.BUSINESS_ID

    const account = await PaymentAccount.create({
        accountNumber,
        type: type.toUpperCase(),
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
    const query = {}

    if (q.type) {
        query.type = q.type.toUpperCase()
    }
    if (q.accountNumber) {
        query.accountNumber = q.accountNumber
    }
    if (q.branchName) {
        query.branchName = q.branchName.toUpperCase()
    }

    console.log(query)

    const account = await PaymentAccount.findOne({
        where: query
    })
    console.log(account)
    return account

}

export const updatePaymentAccount = async (id, data) => {
    /**
     * TODO:
     * if incoming data has secretCredentialsId we need to update aws secret id since its the id we
     * will use to fetch the secret key and consumer key
     **/
    const [account] = await PaymentAccount.update(
        data,
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
    const account = await PaymentAccount.update(
        {isBlocked: true},
        {
            where: {id}
        }
    )
    if (account === 0) {
        return "Account not found"
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