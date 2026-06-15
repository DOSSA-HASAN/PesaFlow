/**
 * @typedef {Object} PurchaseHandlerResponse
 * @property {string} status
 * @property {string} message
 * @property {Object} [order]
 */

export const b2BuyGoodsHandlers = {
    PENDING: (order) => {
        return {
            status: order.status,
            message: "Order created and awaiting processing"
        }
    },

    CONFIRMED: (order) => {
        return {
            status: order.status,
            message: "Order confirmed. Preparing items for dispatch"
        }
    },

    PROCESSING: (order) => {
        return {
            status: order.status,
            message: "Order is being processed and packed"
        }
    },

    SHIPPED: (order) => {
        return {
            status: order.status,
            message: "Order has been shipped and is on the way"
        }
    },

    DELIVERED: (order) => {
        return {
            status: order.status,
            message: "Order delivered successfully"
        }
    },

    FAILED: (order) => {
        return {
            status: order.status,
            message: "Order processing failed"
        }
    },

    CANCELLED: (order) => {
        return {
            status: order.status,
            message: "Order was cancelled"
        }
    },

    RETURNED: (order) => {
        return {
            status: order.status,
            message: "Order was returned by customer"
        }
    },

    TIMEOUT: (order) => {
        return {
            status: order.status,
            message: "Order expired due to no confirmation or payment"
        }
    },
};