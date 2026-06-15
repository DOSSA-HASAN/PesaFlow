/**
 * @typedef {Object} PochiHandlerResponse
 * @property {string} status
 * @property {string} message
 */

export const b2PochiHandlers = {
    PENDING: (transaction) => ({
        status: transaction.status,
        message: "Payment request received and awaiting confirmation",
    }),

    SUCCESS: (transaction) => ({
        status: transaction.status,
        message: "Payment received successfully",
    }),

    FAILED: (transaction) => ({
        status: transaction.status,
        message: "Payment failed",
    }),

    CANCELLED: (transaction) => ({
        status: transaction.status,
        message: "Payment was cancelled by the customer",
    }),

    REVERSED: (transaction) => ({
        status: transaction.status,
        message: "Payment has been reversed",
    }),

    TIMEOUT: (transaction) => ({
        status: transaction.status,
        message: "Payment request timed out",
    }),
};