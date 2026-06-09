import express from "express"
import {getAccessToken} from "./shared/accessToken.js";
import * as mpesaController from "./mpesa.controller.js"
import {paymentAccountResolver} from "../middlewares/paymentAccountResolver.js";
import {initiateStkPush} from "./stk/stk.controller.js";
import {verifyUser} from "../middlewares/auth.middleware.js";
import {initiateB2CPayment} from "./b2c/b2c.controller.js";
import {getMpesaBalance} from "./balance/balance.controller.js";
import {getTransactionStatus} from "./transactionStatus/transactionStatus.controller.js";
import {queryStkTransactionStatus} from "./stk/query/query.controller.js";

const router = express.Router()

// Middleware for all routes to verify users existence in database and ensure valid jwt credentials
router.use(verifyUser)

// Route to get access token from safaricom that will be used in subsequent requests
router.post("/token", getAccessToken)

// Route to generate a payment QR Code
router.post("/qr/generate", paymentAccountResolver, mpesaController.generatePaymentQRCode)

// Route to register validation and confirmation URLs
router.post("/c2b/register-urls", paymentAccountResolver, mpesaController.registerValidationAndConfirmationUrl)

// Route to validate incoming payments
router.post("/validation", paymentAccountResolver, (req, res, next)=>{
    console.log("Validation url")
})

// Route to confirm incoming payments, runs after payment has been processed (validated)
router.post("/confirmation", paymentAccountResolver, (req, res, next) => {
    console.log("Confirmation url")
})

// Route to prompt customers (needs callback)
router.post("/stk/initiate", paymentAccountResolver, initiateStkPush)

// Route to carry out a business-to-customer payment (needs callback)
router.post("/b2c/initiate", paymentAccountResolver, initiateB2CPayment)

// Route to get mpesa wallet balance (needs callback)
router.post("/balance", paymentAccountResolver, getMpesaBalance)

// Route to get mpesa transaction status
// this route is only to fetch info of transactions if they are successful u need the mpesa transaction ID
router.post("/status", paymentAccountResolver, getTransactionStatus)

router.post("/status/stk", paymentAccountResolver, queryStkTransactionStatus)

export default router