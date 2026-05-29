import express from "express"
import {getAccessToken} from "./shared/accessToken.js";
import * as mpesaController from "./mpesa.controller.js"
import {paymentAccountResolver} from "../middlewares/paymentAccountResolver.js";
import {initiateStkPush} from "./stk/stk.controller.js";
import {verifyUser} from "../middlewares/auth.middleware.js";

const router = express.Router()
router.use(verifyUser)
router.post("/token", getAccessToken)
router.post("/qr/generate", paymentAccountResolver, mpesaController.generatePaymentQRCode)
router.post("/c2b/register-urls", paymentAccountResolver, mpesaController.registerValidationAndConfirmationUrl)
router.post("/validation", paymentAccountResolver, (req, res, next)=>{
    console.log("Validation url")
}) // this route will run a function to validate incoming payment, if payments are valid continue and save to db
router.post("/confirmation", paymentAccountResolver, (req, res, next) => {
    console.log("Confirmation url")
}) // runs after payment processed
router.post("/stk/initiate", paymentAccountResolver, initiateStkPush)
router.post("/b2c/initiate", paymentAccountResolver, mpesaController.initiateB2CPayment)

export default router