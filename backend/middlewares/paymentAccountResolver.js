import redisClient from "../utils/redisClient.js";
import PaymentAccount from "../mpesaAccount/payment_account.model.js";
import {errorResponse} from "../utils/response.js";

export const paymentAccountResolver = async (req, res, next) => {
    try {
        const {shortCode} = req.body
        if(!shortCode){
            return errorResponse(res, "Missing payment account number", 400)
        }

        const key = `mpesa:payment_account:${shortCode}`

        const cachedPaymentAccount = await redisClient.get(key)
        if(cachedPaymentAccount){
            req.paymentAccount = JSON.parse(cachedPaymentAccount)
            next()
        } else {
            const fetchedPaymentAccount = await PaymentAccount.findOne({
                where: {shortCode}
            })
            if(!fetchedPaymentAccount){
                return errorResponse(res, "Payment account not found")
            }

            await redisClient.set(`mpesa:payment_account:${fetchedPaymentAccount.shortCode}`, JSON.stringify(fetchedPaymentAccount), {
                "EX":3600
            })
            req.paymentAccount = fetchedPaymentAccount
            next()
        }
    } catch (e) {
        next(e)
    }
}