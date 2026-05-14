import express from "express"
import {getAccessToken} from "./shared/accessToken.js";

const router = express.Router()

router.post("/token", getAccessToken)

export default router