import express from "express"
import {getAccessToken} from "./shared/accessToken.js";
import * as mpesaController from "./mpesa.controller.js"
import {paymentAccountResolver} from "../middlewares/paymentAccountResolver.js";

const router = express.Router()

router.post("/token", getAccessToken)
router.post("/qr/generate", paymentAccountResolver, mpesaController.generatePaymentQRCode)
router.post("/c2b/register-urls", paymentAccountResolver, mpesaController.registerValidationAndConfirmationUrl)
router.post("/validation", paymentAccountResolver, (req, res, next)=>{
    console.log("Validation url")
}) // this route will run a function to validate incoming payment, if payments are valid continue and save to db
router.post("/confirmation", paymentAccountResolver, (req, res, next) => {
    console.log("Confirmation url")
}) // runs after payment processed
router.post("/stk/initiate", paymentAccountResolver, mpesaController.initiateStkPush)

export default router