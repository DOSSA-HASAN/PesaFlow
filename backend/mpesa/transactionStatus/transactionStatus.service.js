import {getIdentifierType} from "../../utils/getIdentifierType.js";
import {darajaRequest} from "../shared/darajaRequest.js";
import {AppError} from "../../utils/AppError.js";

const IS_SANDBOX = process.env.MPESA_ENV === "sandbox"

export const getTransactionStatus = async (mpesaReceiptNumber, originalConversationId, shortCode) => {
    console.log("Running get transaction service")
    const method = "POST"
    const url = "/mpesa/transactionstatus/v1/query"
    const INITIATOR_NAME = process.env.INITIATOR_NAME
    const data = {
        "Initiator": INITIATOR_NAME,
        // TODO: use func to generate security credentials (func exists just check usage)
        "SecurityCredential": "pvEfZf/uYD0XwMnrAW4yAunVVGPoo/zUpkhfa1U1CFZLUPlhS4kl/sjppaAlshK8e5RMV323EEa4cq7IemZ2lLVJDXJq+Xx60Q2G9lALMf9Lytby0/eI8r8oS/BmaIFA1k8VMmgZecWpe6ObribGssiYtdOeTWdh9t4bLY+acxRSqvvTwp0hsAwI7KB/p3vhVtrGBl+r3T0jM5ntZUaseJDpZfW7VGcwmFR8f6zEE+jGY0FB9KDt7phdWRP70smJJUG2udezIEvj3Y2SIEPdj6QGAm07b6WrnShr4NWapm6VAymIBhmLNxVB6JYD04+Ry5ghSscwiTQ1HthATrm3CA==",
        "CommandID": "TransactionStatusQuery",
        "TransactionID": mpesaReceiptNumber,
        // "OriginalConversationID": originalConversationId,
        "PartyA": shortCode,
        "IdentifierType": getIdentifierType(),
        "ResultURL": IS_SANDBOX ? "http://myservice:8080/transactionstatus/result" : process.env.CALLBACK_URL,
        "QueueTimeOutURL": IS_SANDBOX ? "http://myservice:8080/timeout" : process.env.TIMEOUT_URL,
        "Remarks": "OK",
    }

    const res = await darajaRequest({method, url, data})

    if(res.ResponseCode !== "0"){
        console.log(res)
        throw new AppError("Failed to get transaction status", 400)
    }
    return res
}