import {getMpesaEnvironmentSpecificValue} from "../../utils/getMpesaEnvironmentSpecificValue.js";
import {getIdentifierType} from "../../utils/getIdentifierType.js";
import {Payment} from "../../payment/payment.model.js";
import {darajaRequest} from "../shared/darajaRequest.js";
import {b2BuyGoodsHandlers} from "./b2BuyGoods.handlers.js";
import {generateTimestamp} from "../../utils/generateTimestamp.js";
import {addStatusHistory} from "../../utils/addStatusHistory.js";
import {AppError} from "../../utils/AppError.js";
import "dotenv/config.js"

export const b2BuyGoods = async ({amount, shortCode, recieverShortCode, accountReference, remarks = "OK", idempotencyKey, userId}) => {
    let payment
    const method = "POST"
    const url = "/mpesa/b2b/v1/paymentrequest"
    const data = {
        "Initiator": process.env.INITIATOR_NAME,
        // TODO: Generate security credentials for prod
        "SecurityCredential": getMpesaEnvironmentSpecificValue("P6BDx137ITsd7DUKQKCi7m2B0U2Wau2guNn2CGzUK0uW0DZeELgyT/pTQ3gAF6dsnokTqv3LsMuewFjHd2S7Xxv7ZW9c4bd1PJ7h+2sL5qjuiozv+1+jLQmDopZemrT51NGb8hp3cGHAxAXEpglACWXlYydqa85K3xL8LfUvRWdW9GiXO3x7zbKfM0Dyk348GTGq4jlskyCu/NVeAmbj4k4LBKaUeJGh3yC8jAVkjrPdxVkIJI4sBW2OX00b6PrMi8kDQqJK2QXJ/IQSSb22Q7Pcr7aWWci33sBuZhi/VZ1ruTIAg2LGFiFUGbSf3Lw/ESnY5/k7rgmhap/FcOflLw==", "GENERATE SECURITY CERDENTIALS FOR PROD"),
        "CommandID": "BusinessBuyGoods",
        "SenderIdentifierType": getIdentifierType("PB"),
        "RecieverIdentifierType": "4", // Stays constant
        "Amount": amount,
        "PartyA": shortCode,
        "PartyB": recieverShortCode,
        "AccountReference": accountReference,
        "Remarks": remarks,
        "QueueTimeOutURL": getMpesaEnvironmentSpecificValue("https://mydomain.com/businesstobusiness/queue/", process.env.CALLBACK_URL),
        "ResultURL": getMpesaEnvironmentSpecificValue(`${process.env.CALLBACK_URL}/api/mpesa/callback/payment/callbacks`, `${process.env.CALLBACK_URL}/api/mpesa/callback/payment/callbacks`),
    }

    const persistedPayload = {
        ...data,
        "SecurityCredential": "[REDACTED]"
    }

    try {
        payment = await Payment.create({
            reference: accountReference,
            type: "B2TILL",
            idempotencyKey: idempotencyKey,
            amount: amount,
            remarks: remarks,
            partyA: shortCode,
            partyB: recieverShortCode,
            initiatedBy: userId,
            statusHistory: [{
                status: "PENDING", timestamp: new Date().toISOString()
            }],
            mpesaTimestamp: generateTimestamp()
        })
    } catch (e) {
        if (e.name === "SequelizeUniqueConstraintError") {
            const existingPayment = await Payment.findOne({
                where: {idempotencyKey: idempotencyKey}
            })

            if (existingPayment) {
                const handler = b2BuyGoodsHandlers?.[existingPayment.status] ?? b2BuyGoodsHandlers.FAILED
                return handler(existingPayment)
            }
        }
        throw e
    }

    try {

        const res = await darajaRequest({method, url, data})
        if (res.ResponseCode !== "0") {
            await payment.update({
                status: "FAILED",
                conversationId: res.ConversationID,
                originatorConversationId: res.OriginatorConversationID,
                responseCode: res.ResponseCode,
                resultDescription: res.ResponseDescription,
                requestPayload: {request: persistedPayload, response: res},
                statusHistory: addStatusHistory(payment, "FAILED")
            })
            return payment
        }

        payment = await payment.update({
            status: "SUBMITTED",
            conversationId: res.ConversationID,
            originatorConversationId: res.OriginatorConversationID,
            responseCode: res.ResponseCode,
            resultDescription: res.ResponseDescription,
            requestPayload: {request: persistedPayload, response: res},
            statusHistory: addStatusHistory(payment, "SUBMITTED")
        })

        return payment
    } catch (e) {
        try {
            await payment?.update({
                status: "FAILED",
                resultDescription: e.message,
                statusHistory: addStatusHistory(payment, "FAILED")
            })
        } catch (updateError) {
            // log the update error
            throw new AppError(`An error occurred while requesting payment approval: ${updateError.response?.data}`, updateError.statusCode || 500)
        }
        throw new AppError(`An error occurred while requesting payment approval: ${e.message}`, 500)
    }
}