import {getMpesaEnvironmentSpecificValue} from "../../utils/getMpesaEnvironmentSpecificValue.js";
import {getIdentifierType} from "../../utils/getIdentifierType.js";
import {Payment} from "../../payment/payment.model.js";
import {b2PaybillHandlers} from "../b2paybill/b2paybill.handlers.js";
import {stkHandlers} from "../stk/stk.handlers.js";
import {darajaRequest} from "../shared/darajaRequest.js";
import {b2BuyGoodsHandlers} from "./b2BuyGoods.handlers.js";

export const b2BuyGoods = async (amount, shortCode, recieverShortCode, accountReference, remarks = "OK", idempotencyKey, userId) => {
    let payment
    const method = "POST"
    const url = "/mpesa/b2b/v1/paymentrequest"
    const data = {
        "Initiator": process.env.INITIATOR_NAME,
        // TODO: Generate security credentials for prod
        "SecurityCredential": getMpesaEnvironmentSpecificValue("m9MXAVUlNzWlVi/qnwVP+6d7tIFtq6WtT8z5E4p7J2etVNKKbESlzIs7fL8qGsDu3VeMyKIJZJVFCfH2z1oTQSrdkVcgZ3bsPT7GcvMutlo2oIUi/US+CE9vMFm2OULFLz8HTg5BmHt31nhYi29lH9BFZrLVcdTFXMZZ0tPfeIgPkydXeZn1N0dGHwbFDD3RrDfW+B+Q+587JMOU3a7IdDIjZF0BWiEBQTAQa6677kUSTQ2vtptabUxnWERTJ0JXgmJa58M00OSKBAosciW4RpxGcTHKUzsysLyHzkXZJeq6dfKd267ie3qNhFQS+6k584t7ZUXXJXNpNWLmHsY0+Q==", "GENERATE SECURITY CERDENTIALS FOR PROD"),
        "CommandID": "BusinessBuyGoods",
        "SenderIdentifierType": getIdentifierType(),
        "RecieverIdentifierType": "4", // Stays constant
        "Amount": amount,
        "PartyA": shortCode,
        "PartyB": recieverShortCode,
        "AccountReference": accountReference,
        "Remarks": remarks,
        "QueueTimeOutURL": getMpesaEnvironmentSpecificValue("https://mydomain.com/businesstobusiness/queue/", process.env.CALLBACK_URL),
        "ResultURL": getMpesaEnvironmentSpecificValue("https://mydomain.com/businesstobusiness/result/", process.env.TIMEOUT_URL),
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
            initiatedBy: userId
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

    const res = await darajaRequest({method, url, data})
    if (res.ResponseCode !== "0") {
        await payment.update({
            status: "FAILED",
            conversationId: res.ConversationID,
            originatorConversationId: res.OriginatorConversationID,
            resultCode: res.ResponseCode,
            resultDescription: res.ResponseDescription,
            requestPayload: {request: persistedPayload, response: res},
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
}