import express from "express"
import * as paymentController from "./payment_account.controller.js"

const router = express.Router()

router.post("/", paymentController.addPaymentAccount)
router.get('/', paymentController.getAllPaymentAccounts)
router.patch('/:id', paymentController.updatePaymentAccount)
router.patch("/:id/block", paymentController.blockPaymentAccount)
router.patch("/:id/unblock", paymentController.unblockPaymentAccount)

export default router