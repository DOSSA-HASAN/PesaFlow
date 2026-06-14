/**
 * @typedef {Object} B2PaybillHandlerResponse
 * @property {string} status
 * @property {string} message
 * @property {Object} [transaction]
 */
export const b2PaybillHandlers = {
    PENDING: (tx) => {
        return {
            status: tx.status,
            message: "Transaction is being processed"
        };
    },

    SUBMITTED: (tx) => {
        return {
            status: tx.status,
            message: "Payment request submitted to M-Pesa"
        };
    },

    SUCCESS: (tx) => {
        return {
            status: tx.status,
            message: "Funds sent successfully to Paybill"
        };
    },

    FAILED: (tx) => {
        return {
            status: tx.status,
            message: "Transaction failed"
        };
    },

    CANCELLED: (tx) => {
        return {
            status: tx.status,
            message: "Transaction was cancelled"
        };
    },

    TIMEOUT: (tx) => {
        return {
            status: tx.status,
            message: "Transaction timed out. No response received from M-Pesa"
        };
    },
};