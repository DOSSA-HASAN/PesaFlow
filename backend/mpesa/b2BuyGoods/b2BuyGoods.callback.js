/**
 *
 * @param payment: the payment to update in the database
 * @param callback: the callback data from daraja
 * @returns {Promise<void>}
 */
import {addStatusHistory} from "../../utils/addStatusHistory.js";
import {AppError} from "../../utils/AppError.js";

const FINAL_STATES = ["SUCCESS", "CANCELLED", "TIMEOUT", "FAILED"]

const mapB2BuyGoodsStatus = (resultCode) => {
    switch (Number(resultCode)) {
        case 0:
            return "SUCCESS";

        case 1032:
            return "CANCELLED";

        case 200:
            return "TIMEOUT";

        case 1:      // Insufficient balance
        case 1001:   // Subscriber lock failed
        case 1025:   // Push request failed
        case 1037:   // User unreachable
        case 2001:   // Invalid initiator
        case 8006:   // Locked security credential
        case 9999:   // Internal error
        default:
            return "FAILED";
    }
};

export const b2BuyGoodsCallbackHandler = async (payment, callback) => {
    if (!callback) {
        throw new AppError("Missing callback details", 400)
    }

    if (!payment) {
        throw new AppError("Missing payment details", 400)
    }
    console.log(JSON.stringify(callback))

    try {
        if (Number(callback?.ResultCode) === 0) {
            // callback success
            const MPESA_RECEIPT_NUMBER = callback?.TransactionID

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
            const newStatus = mapB2BuyGoodsStatus(callback?.ResultCode)
            await payment.update({
                status: newStatus,
                callbackPayload: callback,
                statusHistory: addStatusHistory(payment, newStatus)
            })
        }

        // emitToUser(payment.initiatedBy, "payment:callback", payment)
        return payment

    } catch (e) {
        throw new AppError(`An error occurred in business-2-till callback handler: ${e.message}`, 500)
    }
}