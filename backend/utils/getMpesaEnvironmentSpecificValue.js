export const getMpesaEnvironmentSpecificValue = (sandboxValue, prodValue) => {
    if (process.env.MPESA_ENV === "sandbox"){
        return sandboxValue
    }
    return prodValue
}