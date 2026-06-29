import {Payment} from "../../payment/payment.model.js";
import {Op} from "sequelize";
import {errorResponse, successResponse} from "../../utils/response.js";
import {stkCallbackHandler} from "../stk/stk.callback.js";
import {b2PochiCallbackHandler} from "../b2Pochi/b2Pochi.callback.js";
import {b2paybillCallbackHandler} from "../b2paybill/b2paybill.callback.js";
import {b2BuyGoodsCallbackHandler} from "../b2BuyGoods/b2BuyGoods.callback.js";

const COMPLETED_FIELDS = [
    "SUCCESS",
    "CANCELLED",
    "TIMEOUT",
    "FAILED"
]

export const callbackHandler = async (req, res, next) => {
    const callback = req.body

    if (!callback) {
        return errorResponse(res, "No request body found in callback", 400)
    }

    if (callback?.Body?.stkCallback) {
        const STK_CALLBACK_BODY = callback?.Body.stkCallback
        const stkCallback = await stkCallbackHandler(STK_CALLBACK_BODY)
        return successResponse(res, stkCallback, "STK payment completed successfully", 200)
    } else if (callback.Result?.TransactionID) {
        const CALLBACK_BODY = callback.Result
        // send payment as argument
        const payment = await Payment.findOne({
            where: {
                [Op.or]: [
                    {originatorConversationId: CALLBACK_BODY.OriginatorConversationID},
                    {conversationId: CALLBACK_BODY.ConversationID}
                ]
            }
        })
        if (!payment) {
            return errorResponse(res, "Payment history not found!", 400)
        }

        if(COMPLETED_FIELDS.includes(payment.status)){
            console.log(`Payment is from db: ${payment.status}`)
            console.log(`Payment is from db: ${payment.statusHistory}`)
            return successResponse(res, payment, "Payment retrieved from database", 200)
        }

        switch (payment?.type) {
            case "B2POCHI":
                console.log(`Payment is from callback: ${payment.status}`)
                console.log(`Payment is from callback: ${payment.statusHistory}`)
                const b2pochiCallback = await b2PochiCallbackHandler(payment, CALLBACK_BODY)
                return successResponse(res, b2pochiCallback, "Business-2-pochi transaction completed successfully", 200)
            case "B2PAYBILL":
                const b2paybillCallback = await b2paybillCallbackHandler(payment, CALLBACK_BODY)
                return successResponse(res, b2paybillCallback, "Business-2-paybill transaction completed successfully", 200)
            case "B2TILL":
                const b2buyGoodsCallback = await b2BuyGoodsCallbackHandler(payment, CALLBACK_BODY)
                console.log(`Payment is from callback: ${payment.status}`)
                console.log(`Payment is from callback: ${payment.statusHistory}`)
                return successResponse(res, b2buyGoodsCallback, "Business-2-till transaction completed successfully", 200)
            default:
                return errorResponse(res, "Unsupported payment type", 400)
        }
    }
}