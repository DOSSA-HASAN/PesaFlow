import axios from "axios";
import "dotenv/config.js"
import {fetchAccessToken} from "./shared/accessToken.js";

const darajaClient = axios.create({
    baseURL: process.env.MPESA_BASE_URL
})

darajaClient.interceptors.request.use(async (config) => {
    const accessToken = await fetchAccessToken()
    config.headers.Authorization = `Bearer ${accessToken}`
    return config
})

darajaClient.interceptors.response.use(
    (response) => response,

    async (error) => {
        const originalRequest = error.config
        if (error.response.status === 401 || error.response.status === 400 && !originalRequest._retry){
            const accessToken = await fetchAccessToken()
            originalRequest.headers.Authorization = `Bearer ${accessToken}`
            originalRequest._retry = true
            return darajaClient(originalRequest)
        }
        return Promise.reject(error)
    }
)

export default darajaClient