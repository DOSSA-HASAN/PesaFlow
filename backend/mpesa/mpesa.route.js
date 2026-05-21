import express from "express"
import {getAccessToken} from "./shared/accessToken.js";
import * as mpesaController from "./mpesa.controller.js"
import {paymentAccountResolver} from "../middlewares/paymentAccountResolver.js";

const router = express.Router()

router.post("/token", getAccessToken)
router.post("/qrcode", paymentAccountResolver, mpesaController.generatePaymentQRCode)

export default router