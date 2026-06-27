import {getMpesaEnvironmentSpecificValue} from "../../utils/getMpesaEnvironmentSpecificValue.js";
import {Payment} from "../../payment/payment.model.js";
import {darajaRequest} from "../shared/darajaRequest.js";
import {AppError} from "../../utils/AppError.js";
import {b2PochiHandlers} from "./b2Pochi.handlers.js";
import {addStatusHistory} from "../../utils/addStatusHistory.js";
import {generateTimestamp} from "../../utils/generateTimestamp.js";
import {generateOriginatorConversationID} from "../../utils/generateOriginatorConversationID.js";
import "dotenv/config.js"

export const b2Pochi = async (amount, shortCode, reciever, remarks = "remarked", reference, idempotencyKey, userId) => {
    console.log(process.env.INITIATOR_NAME)
    let payment
    const method = "POST"
    const url = "/mpesa/b2pochi/v1/paymentrequest"
    const data = {
        "OriginatorConversationID": generateOriginatorConversationID(),
        "InitiatorName": process.env.INITIATOR_NAME,
        // TODO: generate security credentials for prod
        "SecurityCredential": getMpesaEnvironmentSpecificValue("bjnpSVb9VQf94gPtJgl71loDJ4ez66QmIigq6+1cwAKQtvwMQ7ygOAPutuSMDpTD0xui6NeyQxlAHyFkfdPeGzzj6H6D2DnNDt0M62dP5R/fseWUHr4vIB4Ys0fjoFoM7hWcEDcR3f9QDHdeykx+kbWPLnsiyrsPsOFsUOzkG+3C9VPJOL0VYdugPqxaDEvn9qX9jZRkSBSTMT9lPWoqpnrDPTYz6unWnkpVTFGtFkJJlVl0gk3FvebWF4mm2BhyoIsQW2+5U1JC9Fw2pIKuO5SKQNnG3AuQnIIgxpLiqjAqgzXTd7qnd7XP1QBNRnx7UikRtduolg7M/A2AibCG/A==", "GENERATE MPESA SECURITY CREDENTIALS FOR PROD"),
        "CommandID": "BusinessPayToPochi",
        "Amount": amount,
        "PartyA": shortCode,
        "PartyB": reciever,
        "Remarks": remarks,
        "QueueTimeOutURL": getMpesaEnvironmentSpecificValue("https://mydomain.com/path", process.env.TIMEOUT_URL),
        "ResultURL": getMpesaEnvironmentSpecificValue(`${process.env.CALLBACK_URL}/api/mpesa/callback/payment/callbacks`, `${process.env.CALLBACK_URL}/api/mpesa/callback/payment/callbacks`),
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
        console.log(`ORIGINATOR CONVERSATION ID: ${res?.OriginatorConversationID}`)
        if (!res || res.ResponseCode !== "0") {
            console.log(`RES FROM DARAJA: ${res}`)
            console.log(`RES FROM DARAJA: ${res.ResponseCode}`)
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