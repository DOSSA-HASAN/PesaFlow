import express from "express"
import {callbackHandler} from "./callback.handler.js";

const router = express.Router()

router.post('/payment/callbacks', callbackHandler)

export default router