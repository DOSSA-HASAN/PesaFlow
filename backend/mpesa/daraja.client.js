import axios from "axios"
import "dotenv/config.js"

const mpesaDarajaClient = axios.create({
    baseURL: process.env.MPESA_BASE_URL
})