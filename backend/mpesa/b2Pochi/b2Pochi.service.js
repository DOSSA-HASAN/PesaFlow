import {getMpesaEnvironmentSpecificValue} from "../../utils/getMpesaEnvironmentSpecificValue.js";
import {Payment} from "../../payment/payment.model.js";
import {b2BuyGoodsHandlers} from "../b2BuyGoods/b2BuyGoods.handlers.js";
import {darajaRequest} from "../shared/darajaRequest.js";
import {AppError} from "../../utils/AppError.js";
import {b2PochiHandlers} from "./b2Pochi.handlers.js";

export const b2Pochi = async (amount, shortCode, reciever, remarks = "remarked", reference, idempotencyKey, userId) => {
    let payment
    const method = "POST"
    const url = "/mpesa/b2pochi/v1/paymentrequest"
    const data = {
        "OriginatorConversationID": "600997_Test_32et3241ed8yu",
        "InitiatorName": process.env.INITIATOR_NAME,
        // TODO: generate security credentials for prod
        "SecurityCredential": getMpesaEnvironmentSpecificValue("RC6E9WDxXR4b9X2c6z3gp0oC5Th ==", "GENERATE MPESA SECURITY CREDENTIALS FOR PROD"),
        "CommandID": "BusinessPayToPochi",
        "Amount": amount,
        "PartyA": shortCode,
        "PartyB": reciever,
        "Remarks": remarks,
        "QueueTimeOutURL": getMpesaEnvironmentSpecificValue("https://mydomain.com/path", process.env.TIMEOUT_URL),
        "ResultURL": getMpesaEnvironmentSpecificValue("https://mydomain.com/path", process.env.CALLBACK_URL)
    }

    const persistedPayload = {
        ...data,
        "SecurityCredential": "[REDACTED]"
    }

    try {
        payment = await Payment.create({
            reference: reference,
            type: "B2POCHI",
            idempotencyKey: idempotencyKey,
            amount: amount,
            remarks: remarks,
            partyA: shortCode,
            partyB: reciever,
            initiatedBy: userId,
            requestPayload: {request: persistedPayload},
        })
    } catch (e) {
        if (e.name === "SequelizeUniqueConstraintError") {
            const existingPayment = await Payment.findOne({
                where: {idempotencyKey: idempotencyKey}
            })

            if (existingPayment) {
                const handler = b2PochiHandlers?.[existingPayment.status] ?? b2PochiHandlers.FAILED
                return handler(existingPayment)
            }
        }
        throw e
    }

    try {
        const res = await darajaRequest({method, url, data})
        if (res.ResponseCode !== "0") {
            payment = await payment.update({
                status: "FAILED",
                conversationId: res.ConversationID,
                originatorConversationId: res.OriginatorConversationID,
                resultCode: res.ResponseCode,
                resultDescription: res.ResponseDescription,
                requestPayload: {request: persistedPayload, response: res,},
            })
            return payment
        }

        payment = await payment.update({
            status: "SUBMITTED",
            conversationId: res.ConversationID,
            originatorConversationId: res.OriginatorConversationID,
            resultCode: res.ResponseCode,
            resultDescription: res.ResponseDescription,
            requestPayload: {request: persistedPayload, response: res},
        })

        return payment

    } catch (e) {
        throw AppError(`An error occurred while requesting payment approval: ${e.response?.data}`)
    }
}