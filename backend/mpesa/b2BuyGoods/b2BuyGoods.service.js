import { getMpesaEnvironmentSpecificValue } from "../../utils/getMpesaEnvironmentSpecificValue.js";
import { getIdentifierType } from "../../utils/getIdentifierType.js";
import { Payment } from "../../payment/payment.model.js";
import { darajaRequest } from "../shared/darajaRequest.js";
import { b2BuyGoodsHandlers } from "./b2BuyGoods.handlers.js";
import { generateTimestamp } from "../../utils/generateTimestamp.js";
import { addStatusHistory } from "../../utils/addStatusHistory.js";
import { AppError } from "../../utils/AppError.js";
import "dotenv/config.js"

export const b2BuyGoods = async ({ amount, shortCode, recieverShortCode, accountReference, remarks = "OK", idempotencyKey, userId }) => {
    let payment
    const method = "POST"
    const url = "/mpesa/b2b/v1/paymentrequest"
    const data = {
        "Initiator": process.env.INITIATOR_NAME,
        // TODO: Generate security credentials for prod
        "SecurityCredential": "\"mrnNo266+gvxDkgiN5ZSgsI/uwb/y7xxZzP6+a070V2EGHIZsW83X4Qsih1dQEoU+P70BmUO34ErTUKS8Q3OP3YTRmRpXffl2OA1df0RfuBTsy6ie9x0AywL1JjK8jtGqMjSjHcjWSEdf4t8hKcLfCYTQIiEMdh7TdrsrDiVab0ojz0INQrEMSk0d3WT+8UuPkT8eOxSuvTPsyIA3Usw0m6/vz+36XfYlzdCnWlVa/GJx24m60jsKbKzaSt+FYZPWP/nDtwoa1qCW/henMd8g1fHakPEjhjRhlJ0mXN1nEOTYavH7FCCQete2ePkfXIs4tf2bKkx+oalFmOVUQS1tQ==\"",
        "CommandID": "BusinessPayBill",
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
            mpesaTimestamp: generateTimestamp(),
            remarks
        })
    } catch (e) {
        if (e.name === "SequelizeUniqueConstraintError") {
            const existingPayment = await Payment.findOne({
                where: { idempotencyKey: idempotencyKey }
            })

            if (existingPayment) {
                const handler = b2BuyGoodsHandlers?.[existingPayment.status] ?? b2BuyGoodsHandlers.FAILED
                return handler(existingPayment)
            }
        }
        throw e
    }

    try {

        const res = await darajaRequest({ method, url, data })
        if (res.ResponseCode !== "0") {
            await payment.update({
                status: "FAILED",
                conversationId: res.ConversationID,
                originatorConversationId: res.OriginatorConversationID,
                responseCode: res.ResponseCode,
                resultDescription: res.ResponseDescription,
                requestPayload: { request: persistedPayload, response: res },
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
            requestPayload: { request: persistedPayload, response: res },
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