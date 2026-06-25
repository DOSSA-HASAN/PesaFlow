import express from "express"
import {callbackHandler} from "./callback.handler.js";

const router = express.Router()

router.post('/stk/callback', callbackHandler)

export default router