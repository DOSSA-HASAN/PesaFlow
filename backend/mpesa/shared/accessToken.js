import "dotenv/config.js"
import axios from "axios";
import {successResponse} from "../../utils/response.js";
import redisClient from "../../utils/redisClient.js";
import {AppError} from "../../utils/AppError.js";

export const getAccessToken = async (req, res, next) => {
    try {
        const response  = await fetchAccessToken()
        return successResponse(
            res,
            response,
            "Access token generated",
            200
        );
    } catch (e) {
        next(e)
    }
}

export const fetchAccessToken = async () => {
    const cachedToken = await redisClient.get("mpesa:access_token")

    if (cachedToken) {
        return cachedToken
    }

    const lock = await redisClient.set("mpesa:access_token:lock", "1", {NX: true, EX: 60})

    // if lock fails try fetch cache token again
    if (!lock) {
        const retryToken = await redisClient.get("mpesa:access_token")
        if (retryToken) {
            return retryToken
        }

        throw new AppError("Token is being generated please wait")
    }

    try {
        // TODO: use aws secrets for consumer key and secrets
        // obtain required variables to generate auth token
        const BASE_URL = process.env.MPESA_BASE_URL
        const URL = `${BASE_URL}/oauth/v1/generate?grant_type=client_credentials`
        // generate basic auth string
        const auth = Buffer.from(
            `${process.env.MPESA_CONSUMER_KEY}:${process.env.MPESA_CONSUMER_SECRET}`
        ).toString('base64')
        const response = await axios.get(URL, {
            headers: {
                Authorization: `Basic ${auth}`
            }
        })

        const token = response.data.access_token
        const expiresIn = response.data.expires_in

        // set newly fetched token in redis
        await redisClient.set("mpesa:access_token", token, {EX: expiresIn - 60})

        return token
    } catch (e) {
        throw new AppError(e.message, e.statusCode)
    } finally {
        await redisClient.del("mpesa:access_token:lock")
    }
}