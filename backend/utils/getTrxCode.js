export const getTrxCode = (shortCodeType = process.env.MPESA_SHORTCODE_TYPE) => {
    switch (shortCodeType) {
        case "BG":
            return "BG"
        case "TILL":
            return "PB"
        case "WA":
            return "WA"
    }
}