import {sequelize} from "../../config/db.js";
import {darajaRequest} from "../shared/darajaRequest.js";
import {Payment} from "../../payment/payment.model.js";
import {b2cHandlers} from "./b2c.handlers.js";
import {AppError} from "../../utils/AppError.js";
import {randomUUID} from "crypto"

const BASE_URL = process.env.MPESA_BASE_URL
const IS_SANDBOX = process.env.MPESA_ENV === "sandbox"

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
    const transaction = await sequelize.transaction()
    try {
        const method = "POST"
        const url = "/mpesa/b2c/v3/paymentrequest"
        // const securityCredentials = await generateSecurityCredential()
        const availableCommandIDs = ["SalaryPayment", "BusinessPayment", "PromotionPayment"]
        if (!availableCommandIDs.includes(commandId)) {
            throw new AppError(`Invalid Command ID: ${commandId}`)
        }

        const OriginatorConversationID = randomUUID()

        const data = {
            "OriginatorConversationID": OriginatorConversationID,
            "InitiatorName": process.env.INITIATOR_NAME,
            "SecurityCredential": "UCyA878pZBwOrYE4idghFh9uhEjy4KqbyvTDI+4MCeg0O3ssv2yzgUlO5iLVETvGOP6YytdGUJui6NwDT7wrtf+3yEvQ6jYdiGNr2b3MPwARf0iHLZiz+B7trstfFmNJBvCwjAtoxcdWkrVsTxHX+RbZeoFjEpq2K2Bxe4+6s/Bp1uIEE1aQq4ltMT+hNmVyyJXowSJrHWfdyXqx5iqNGuY/gPSXv8Wf2yPLdqRrPnSM445tqjlLpnzkrRX6ohB5YCfxIDvWxCOXFt8RWE+2ek/TwHc3+PXKNqEQMuH7W3KpqmjfMzjjhlCNRSPti2VIA1RUaw+KpL8eG9hWc4DqZw==", // TODO: get from mpesa portal
            "CommandID": commandId,
            "Amount": amount,
            "PartyA": shortCode,
            "PartyB": receiver,
            "Remarks": remarks,
            "QueueTimeOutURL": IS_SANDBOX ? "https://mydomain.com/b2c/queue/" : timeoutUrl,
            "ResultURL": IS_SANDBOX ? "https://mydomain.com/b2c/result/" : confirmationUrl,
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
                requestPayload: data,
                initiatedBy: initiatedBy
            }, {transaction})
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

        const res = await darajaRequest({method, url, data})
        const success = String(res.ResponseCode) === "0"
        if (!success) {
            return res
        }

        await payment.update({
            status: "SUBMITTED",
            conversationId: res.ConversationID,
            resultCode: res.ResponseCode,
            resultDescription: res.ResponseDescription,
        }, {transaction})
        await transaction.commit()
        return res
    } catch (e) {
        await transaction.rollback()
        throw e
    }
}
