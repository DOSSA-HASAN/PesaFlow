import darajaClient from "../daraja.client.js";

export const darajaRequest = async ({method = "GET", url, data = {}, params = {}, headers = {}}) => {
    try {
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
        console.error(e.message)
        throw e
    }
}