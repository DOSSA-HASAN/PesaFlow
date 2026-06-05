/**
 * @typedef {Object} StkHandlerResponse
 * @property {string} status
 * @property {string} message
 * @property {Object} [payment]
 */
export const b2cHandlers =  {
    PENDING: (tx) => {
        return {
            status: tx.status,
            message: "Transaction is awaiting processing."
        }
    },
    SUBMITTED: (tx) => {
        return {
            status: tx.status,
            message: "Disbursement request accepted and is being processed by M-Pesa."
        }
    },
    SUCCESS: (tx) => {
        return {
            status: tx.status,
            message: "Disbursement completed successfully."
        }
    },
    FAILED: (tx) => {
        return {
            status: tx.status,
            message: "Disbursement failed."
        }
    },
    CANCELLED: (tx) => {
        return {
            status: tx.status,
            message: "Disbursement was cancelled."
        }
    },
    TIMEOUT: (tx) => {
        return {
            status: tx.status,
            message: "Disbursement status could not be confirmed within the expected time."
        }
    },

}