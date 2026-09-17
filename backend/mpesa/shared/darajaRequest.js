import darajaClient from "../daraja.client.js";

export const darajaRequest = async ({method = "GET", url, data = {}, params = {}, headers = {}}) => {
    try {
        console.log(`QRCode service func running...`)
        const res = await darajaClient({
            method,
            url,
            data,
            params,
            headers
        })
        console.log(method)
        console.log(url)
        console.log(data)
        return res.data
    } catch (e) {
        console.log(`QRCode service catch block running...`)
        console.error(e.message)
        console.error(e)
        console.error(e.stackTrace)
        throw e
    }
}