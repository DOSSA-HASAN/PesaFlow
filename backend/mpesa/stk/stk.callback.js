/**
 *
 * @param payment: the payment to update in the database
 * @param callback: the callback data from daraja
 * @returns {Promise<void>}
 */
import {addStatusHistory} from "../../utils/addStatusHistory.js";
import {AppError} from "../../utils/AppError.js";
import {Payment} from "../../payment/payment.model.js";
import {Op} from "sequelize";
import {emitToUser} from "../../utils/sockets.js";

const FINAL_STATES = ["SUCCESS", "CANCELLED", "TIMEOUT", "FAILED"]

const mapStkStatus = (resultCode) => {
    switch (Number(resultCode)) {
        case 0:
            return "SUCCESS";

        case 1032:
            return "CANCELLED";

        case 1:
        case 2001:
            return "FAILED";

        default:
            return "FAILED";
    }
};

export const stkCallbackHandler = async (callback) => {
    console.log("RUNNING CALLBACK STK")
    if (!callback) {
        throw new AppError("Missing callback details", 400)
    }
    // find payment here
    const payment = await Payment.findOne({
        where: {
            status: {
                [Op.notIn]: ["CANCELLED", "TIMEOUT", "FAILED"],
            }, checkoutRequestId: callback.CheckoutRequestID
        }
    })

    if (!payment) {
        throw new AppError("Payment history not found", 400)
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
            const items = Object.fromEntries(itemsArray
                .filter(i => i?.Name)
                .map(i => [i.Name, i.Value]))

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
                status: mapStkStatus(callback?.ResultCode),
                callbackPayload: callback,
                statusHistory: addStatusHistory(payment, mapStkStatus(callback?.ResultCode))
            })
        }

        emitToUser(payment.initiatedBy, "stk:callback", payment)
        return payment

    } catch (e) {
        throw new AppError(`An error occurred in STK callback handler: ${e.message}`, 500)
    }
}