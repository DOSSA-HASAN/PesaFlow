/**
 * @typedef {Object} StkHandlerResponse
 * @property {string} status
 * @property {string} message
 * @property {Object} [payment]
 */
export const stkHandlers =  {
    PENDING: (tx) => {
        return {
            status: tx.status,
            message: "Awaiting customer approval"
        }
    },
    SUBMITTED: (tx) => {
        return {
            status: tx.status,
            message: "Payment request sent. Waiting for customer to complete payment on phone"
        }
    },
    SUCCESS: (tx) => {
        return {
            status: tx.status,
            message: "Payment received successfully"
        }
    },
    FAILED: (tx) => {
        return {
            status: tx.status,
            message: "Payment failed"
        }
    },
    CANCELLED: (tx) => {
        return {
            status: tx.status,
            message: "Payment cancelled by customer"
        }
    },
    TIMEOUT: (tx) => {
        return {
            status: tx.status,
            message: "Payment request expired. No response was received from customers phone"
        }
    },

}