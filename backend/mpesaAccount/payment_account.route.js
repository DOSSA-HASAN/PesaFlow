import express from "express"
import * as paymentController from "./payment_account.controller.js"
import {authorize} from "../middlewares/checkRole.middleware.js";
import {verifyUser} from "../middlewares/auth.middleware.js";

const router = express.Router()

// Middleware for all routes to verify users existence in database and ensure valid jwt credentials
router.use(verifyUser)

// Route to add payment accounts (paybill or buy goods number) to db
router.post("/", authorize(["payment.account.create"]), paymentController.addPaymentAccount)

// Route to view all payment accounts
router.get('/', authorize(["payment.account.view"]), paymentController.getAllPaymentAccounts)

// Route to update payment account
router.patch('/:id', authorize(["payment.account.update"]), paymentController.updatePaymentAccount)

// Route to block usage of a payment account
router.patch("/:id/block", authorize(["payment.account.update"]), paymentController.blockPaymentAccount)

// Route to unblock a previously blocked payment account
router.patch("/:id/unblock", authorize(["payment.account.update"]), paymentController.unblockPaymentAccount)

export default router