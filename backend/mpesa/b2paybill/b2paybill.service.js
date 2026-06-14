import "dotenv/config.js"
import {getIdentifierType} from "../../utils/getIdentifierType.js";
import {Payment} from "../../payment/payment.model.js";
import {darajaRequest} from "../shared/darajaRequest.js";
import {stkHandlers} from "../stk/stk.handlers.js";
import {b2PaybillHandlers} from "./b2paybill.handlers.js";
import {getMpesaEnvironmentSpecificValue} from "../../utils/getMpesaEnvironmentSpecificValue.js";

const IS_SANDBOX = process.env.MPESA_ENV === "sandbox"

export const b2paybill = async (amount, shortCode, receiverShortCode, accountRef, idempotencyKey, userId,) => {
    let payment;
    const method = "POST"
    const url = "/mpesa/b2b/v1/paymentrequest"
    const data = {
        "Initiator": process.env.INITIATOR_NAME,
        // TODO: GENERATE SECURITY CREDENTIALS FOR PROD
        "SecurityCredential": getMpesaEnvironmentSpecificValue("dFt2o0bR7G3hYa9v+Z8ZoFowg3l6th+VU1aucFHPLZbex38yoA+XZcIM0iLfTivxgkuEqZQnyYlYdEW0uS8eQuPEAAhr6KiczPJCnzOsfrQbv7ddjm8RwseuAr7PY9N8hp6saBZxEji+ybLAU1i5FrP7EhFCj4imVh8RnaJjYmdNAfWBE5T8OdFZFiQM78JFXLVzinUpyvXriPHH5eC8A50tvYQ5zM0U3aZ+0J/sPBKgo9K6Nha+eHfRp+iOaou9QVbMagnY5JUbDdwZr7yzI3tGsA1jt42Kmv8Ehuf6JtGrEOAyTXp6ZwCrDxgv/x38zvOzKFuECKIiDSpA6xcLbQ==", "GENERATE SECURITY CREDENTIALS FOR PROD"),
        "CommandID": "BusinessPayBill",
        "SenderIdentifierType": getIdentifierType(),
        "RecieverIdentifierType": "4", // REMAINS 4 THROUGHOUT SINCE RECEIVER IS ALWAYS A PAYBILL NUMBER
        "Amount": amount,
        "PartyA": shortCode,
        "PartyB": receiverShortCode,
        "AccountReference": accountRef,
        "Remarks": "OK",
        "QueueTimeOutURL": getMpesaEnvironmentSpecificValue("https://mydomain.com/businesstobusiness/queue/", process.env.TIMEOUT_URL,),
        "ResultURL": getMpesaEnvironmentSpecificValue("https://mydomain.com/businesstobusiness/result/", process.env.CALLBACK_URL,)
    }
    const persistedPayload = {
        ...data,
        "SecurityCredential": "[REDACTED]"
    }

    try {
        payment = await Payment.create({
            type: "B2PAYBILL",
            idempotencyKey: idempotencyKey,
            amount: amount,
            partyA: shortCode,
            partyB: receiverShortCode,
            initiatedBy: userId,
            reference: accountRef
        })
    } catch (e) {
        if (e.name === "SequelizeUniqueConstraintError") {
            const existingPayment = await Payment.findOne({
                where: {idempotencyKey: idempotencyKey}
            })

            if (existingPayment) {
                const handler = b2PaybillHandlers?.[existingPayment.status] ?? b2PaybillHandlers.FAILED
                return handler(existingPayment)
            }
        }
        throw e
    }

    const res = await darajaRequest({method, url, data})
    console.log(`DARAJA API RES: ${res}`)

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

    const updatedPayment = await payment.update({
        status: "SUBMITTED",
        conversationId: res.ConversationID,
        originatorConversationId: res.OriginatorConversationID,
        resultCode: res.ResponseCode,
        resultDescription: res.ResponseDescription,
        requestPayload: {request: persistedPayload, response: res},
    })

    return updatedPayment
}