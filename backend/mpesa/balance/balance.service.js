import {AppError} from "../../utils/AppError.js";
import "dotenv/config.js"
import {darajaRequest} from "../shared/darajaRequest.js";
import {getIdentifierType} from "../../utils/getIdentifierType.js";
import {getMpesaEnvironmentSpecificValue} from "../../utils/getMpesaEnvironmentSpecificValue.js";

const IS_SANDBOX = process.env.MPESA_ENV === "sandbox"

export const getMpesaBalance = async (shortCode) => {
    const method = "POST"
    const url = "/mpesa/accountbalance/v1/query"
    const INITIATOR = process.env.INITIATOR_NAME
    const data = {
        "Initiator": INITIATOR,
        // TODO: use func to generate security credentials (func exists just check usage)
        "SecurityCredential": getMpesaEnvironmentSpecificValue("iQSCG0dbOcBdFSZJCCzwLntdDffq7mwbAG8vYdoNwa4wQqL/14wOuTgYkvcjgy2d3g7HXxTO+76BPGMdEDXpZvsJwxpEuKyGDQHZ0QNOUsS/aaockYMsZ0J4VsuCYC5shrXkrbsGLxwzVu/B4y9oaoG7ibptdMnuMnWxSNq8Up5hP+DdLsB8uknvkzDnk+XawCbBi1zL4ILaCp6Uj5eovQuSHVyToFNYrnO7L7zPL/IwcFYTchr0xudCucGhXcVftfjliNleUbOJO7cx9mNTqP4jdEa/bW35teKssXJXs5dMHOoAOirsq9AVR4HRXzLdX6Mg/6aobbGmho4w85gaMg==", "GENERATE_VALUE FOR PROD"), // TODO: GENERATE ACTUAL VALUE FOR PROD,
        "CommandID": "AccountBalance",
        "PartyA": shortCode,
        "IdentifierType": getIdentifierType(),
        "Remarks": "ok",
        "QueueTimeOutURL": getMpesaEnvironmentSpecificValue("https://mydomain.com/AccountBalance/queue/", process.env.TIMEOUT_URL),
        "ResultURL": getMpesaEnvironmentSpecificValue("https://mydomain.com/AccountBalance/result/", process.env.CALLBACK_URL)
    }
    const res = await darajaRequest({method, url, data})
    if (res.ResponseCode !== "0") {
        throw new AppError("Failed to get balance", 400)
    }
    return res
}