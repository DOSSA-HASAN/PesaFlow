import {getMpesaEnvironmentSpecificValue} from "../../utils/getMpesaEnvironmentSpecificValue.js";
import {Payment} from "../../payment/payment.model.js";
import {darajaRequest} from "../shared/darajaRequest.js";
import {AppError} from "../../utils/AppError.js";
import {b2PochiHandlers} from "./b2Pochi.handlers.js";
import {addStatusHistory} from "../../utils/addStatusHistory.js";
import {generateTimestamp} from "../../utils/generateTimestamp.js";
import {generateOriginatorConversationID} from "../../utils/generateOriginatorConversationID.js";

export const b2Pochi = async (amount, shortCode, reciever, remarks = "remarked", reference, idempotencyKey, userId) => {
    let payment
    const method = "POST"
    const url = "/mpesa/b2pochi/v1/paymentrequest"
    const data = {
        "OriginatorConversationID": generateOriginatorConversationID(),
        "InitiatorName": process.env.INITIATOR_NAME,
        // TODO: generate security credentials for prod
        "SecurityCredential": getMpesaEnvironmentSpecificValue("RC6E9WDxXR4b9X2c6z3gp0oC5Th ==", "GENERATE MPESA SECURITY CREDENTIALS FOR PROD"),
        "CommandID": "BusinessPayToPochi",
        "Amount": amount,
        "PartyA": shortCode,
        "PartyB": reciever,
        "Remarks": remarks,
        "QueueTimeOutURL": getMpesaEnvironmentSpecificValue("https://mydomain.com/path", process.env.TIMEOUT_URL),
        "ResultURL": getMpesaEnvironmentSpecificValue("https://mydomain.com/path", process.env.CALLBACK_URL),
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
            statusHistory: [{
                status: "PENDING",
                timestamp: new Date().toISOString()
            }],
            mpesaTimestamp: generateTimestamp()
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
        if (!res || res.ResponseCode !== "0") {
            await payment.update({
                status: "FAILED",
                conversationId: res?.ConversationID,
                originatorConversationId: res?.OriginatorConversationID,
                responseCode: res?.ResponseCode,
                resultDescription: res?.ResponseDescription,
                requestPayload: {request: persistedPayload, response: res || null,},
                statusHistory: addStatusHistory(payment, "FAILED")
            })
            return payment
        }

        await payment.update({
            status: "SUBMITTED",
            conversationId: res?.ConversationID,
            originatorConversationId: res?.OriginatorConversationID,
            responseCode: res?.ResponseCode,
            resultDescription: res?.ResponseDescription,
            requestPayload: {request: persistedPayload, response: res || null},
            statusHistory: addStatusHistory(payment, "SUBMITTED")
        })

        return payment

    } catch (e) {
        await payment.update({
            status: "FAILED",
            resultDescription: e.message, requestPayload: {request: persistedPayload},
            statusHistory: addStatusHistory(payment, "FAILED")
        })
        throw new AppError(`An error occurred while requesting payment approval`, 500)
    }
}