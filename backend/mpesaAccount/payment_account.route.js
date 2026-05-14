import express from "express"
import * as paymentController from "./payment_account.controller.js"

const router = express.Router()

router.post("/", paymentController.addPaymentAccount)
router.get('/', paymentController.getAllPaymentAccounts)

export default router