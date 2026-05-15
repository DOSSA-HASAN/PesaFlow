import express from "express"
import * as paymentController from "./payment_account.controller.js"
import {authorize} from "../middlewares/checkRole.middleware.js";

const router = express.Router()

router.post("/", authorize(["payment.account.create"]), paymentController.addPaymentAccount)
router.get('/', authorize(["payment.account.view"]), paymentController.getAllPaymentAccounts)
router.patch('/:id', authorize(["payment.account.update"]), paymentController.updatePaymentAccount)
router.patch("/:id/block", authorize(["payment.account.update"]), paymentController.blockPaymentAccount)
router.patch("/:id/unblock", authorize(["payment.account.update"]), paymentController.unblockPaymentAccount)

export default router