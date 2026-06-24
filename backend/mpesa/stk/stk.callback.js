/**
 *
 * @param payment: the payment to update in the database
 * @param callback: the callback data from daraja
 * @returns {Promise<void>}
 */
import {addStatusHistory} from "../../utils/addStatusHistory.js";
import {AppError} from "../../utils/AppError.js";

const FINAL_STATES = [
    "SUCCESS",
    "CANCELLED",
    "FAILED",
]

export const stkCallbackHandler = async (payment, callback) => {
    if (!payment) {
        throw new AppError("Missing payment details", 400)
    }


    if (!callback) {
        throw new AppError("Missing callback details", 400)
    }

    if (FINAL_STATES.includes(payment.status)) {
        return payment
    }

    try {
        if (Number(callback?.ResultCode) === 0) {
            // callback success
            console.log(`PAYMENT MODEL TO UPDATE: ${payment}`)
            console.log(`MPESA CALLBACK BODY: ${callback}`)

            const rawItems = callback?.CallbackMetadata?.Item
            const itemsArray = Array.isArray(rawItems) ? rawItems : rawItems ? [rawItems] : []
            const items = Object.fromEntries(
                itemsArray
                    .filter(i => i?.Name)
                    .map(i => [i.Name, i.Value])
            )

            const getItem = (name) => items[name]

            const MPESA_RECEIPT_NUMBER = getItem("MpesaReceiptNumber")
            console.log(`MPESA RECIEPT NUMBER: ${MPESA_RECEIPT_NUMBER}`)

            if (!MPESA_RECEIPT_NUMBER) {
                throw new AppError("Missing mpesa receipt number", 400)
            }

            await payment.update({
                status: "SUCCESS",
                callbackPayload: callback,
                externalReceiptNumber: MPESA_RECEIPT_NUMBER,
                statusHistory: addStatusHistory(payment, "SUCCESS")
            })
        } else {
            // callback with errors
            await payment.update({
                status: "FAILED", callbackPayload: callback, statusHistory: addStatusHistory(payment, "FAILED")
            })
        }

    } catch (e) {
        // Logs
        console.error(e)
        console.error(e.message)
        console.error(e.response)
        console.error(e.response?.data)
        throw new AppError(`An error occurred in STK callback handler: ${e.message}`, 500)
    }
}