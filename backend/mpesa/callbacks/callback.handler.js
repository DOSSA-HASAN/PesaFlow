import {Payment} from "../../payment/payment.model.js";
import {Op} from "sequelize";
import {errorResponse, successResponse} from "../../utils/response.js";
import {stkCallbackHandler} from "../stk/stk.callback.js";

const COMPLETED_FIELDS = [
    "SUCCESS",
    "CANCELLED",
    "TIMEOUT",
    "FAILED"
]

export const callbackHandler = async (req, res, next) => {
    console.log("RUNNING CALLBACK HANDLER")
    const callback = req.body.Body

    if(!callback){
        return errorResponse(res, "No request body found in callback", 400)
    }

    if(callback?.stkCallback){
        console.log("CALLBACK HANDLER FUNCTION RUNNING")
        const stkCallback = await stkCallbackHandler(callback?.stkCallback)
        return successResponse(res, stkCallback, "STK payment completed successfully", 200)
    } else {
        console.log("Callback completed")
    }
}