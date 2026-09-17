import express from "express"
import { callbackHandler } from "./callback.handler.js";

const router = express.Router()

router.post('/payment/callbacks', (req, res, next) => {
    console.log("Callback route running...")
    next()
}, callbackHandler)
router.post('/payment/timeout', (req, res) => {
    return res.json(res.body)
})

export default router