import {sequelize} from "../../config/db.js";
import {darajaRequest} from "../shared/darajaRequest.js";
import {Payment} from "../../models/index.js"
import {b2cHandlers} from "./b2c.handlers.js";
import {AppError} from "../../utils/AppError.js";
import {randomUUID} from "crypto"
import {getMpesaEnvironmentSpecificValue} from "../../utils/getMpesaEnvironmentSpecificValue.js";
import {generateTimestamp} from "../../utils/generateTimestamp.js";
import {addStatusHistory} from "../../utils/addStatusHistory.js";
import {generateOriginatorConversationID} from "../../utils/generateOriginatorConversationID.js";

export const initiateB2CPayment = async ({
                                             reference = `B2C-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
                                             idempotencyKey,
                                             commandId,
                                             amount,
                                             shortCode,
                                             receiver,
                                             remarks = "remarked",
                                             confirmationUrl,
                                             timeoutUrl,
                                             initiatedBy
                                         }) => {
    let payment;
    const method = "POST"
    const url = "/mpesa/b2c/v3/paymentrequest"
    // const securityCredentials = await generateSecurityCredential()
    const availableCommandIDs = ["SalaryPayment", "BusinessPayment", "PromotionPayment"]
    if (!availableCommandIDs.includes(commandId)) {
        throw new AppError(`Invalid Command ID: ${commandId}`)
    }

    const OriginatorConversationID = generateOriginatorConversationID()

    const data = {
        "OriginatorConversationID": OriginatorConversationID,
        "InitiatorName": process.env.INITIATOR_NAME,
        "SecurityCredential": getMpesaEnvironmentSpecificValue("UCyA878pZBwOrYE4idghFh9uhEjy4KqbyvTDI+4MCeg0O3ssv2yzgUlO5iLVETvGOP6YytdGUJui6NwDT7wrtf+3yEvQ6jYdiGNr2b3MPwARf0iHLZiz+B7trstfFmNJBvCwjAtoxcdWkrVsTxHX+RbZeoFjEpq2K2Bxe4+6s/Bp1uIEE1aQq4ltMT+hNmVyyJXowSJrHWfdyXqx5iqNGuY/gPSXv8Wf2yPLdqRrPnSM445tqjlLpnzkrRX6ohB5YCfxIDvWxCOXFt8RWE+2ek/TwHc3+PXKNqEQMuH7W3KpqmjfMzjjhlCNRSPti2VIA1RUaw+KpL8eG9hWc4DqZw==", "GENERATE SECURITY CREDENTIALS FOR PROD"), // TODO: get from mpesa portal
        "CommandID": commandId,
        "Amount": amount,
        "PartyA": shortCode,
        "PartyB": receiver,
        "Remarks": remarks,
        "QueueTimeOutURL": getMpesaEnvironmentSpecificValue("https://mydomain.com/b2c/queue/", timeoutUrl,),
        "ResultURL": getMpesaEnvironmentSpecificValue("https://mydomain.com/b2c/result/", confirmationUrl,)
    }

    const persistedPayload = {
        ...data, "SecurityCredential": "[REDACTED]"
    }

    try {
        payment = await Payment.create({
            reference: reference,
            type: "B2C",
            idempotencyKey: idempotencyKey,
            status: "PENDING",
            amount: amount,
            phoneNumber: receiver,
            partyA: shortCode,
            partyB: receiver,
            remarks: remarks,
            originatorConversationId: OriginatorConversationID,
            requestPayload: persistedPayload,
            initiatedBy: initiatedBy,
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
                const handler = b2cHandlers?.[existingPayment.status] ?? b2cHandlers.FAILED
                return handler(existingPayment)
            }
        }
        throw e
    }

    try {
        const res = await darajaRequest({method, url, data})
        const success = String(res.ResponseCode) === "0"
        if (!success) {
            await payment.update({
                status: "FAILED",
                conversationId: res?.ConversationID,
                originatorConversationId: res?.OriginatorConversationID,
                responseCode: res?.ResponseCode,
                resultDescription: res?.ResponseDescription,
                requestPayload: {request: persistedPayload, response: res || null},
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
