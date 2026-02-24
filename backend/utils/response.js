// utils.response.js

/**
 * @param res - Express response object
 * @param statusCode - HTTP status code (default 200)
 * @param message - Optional message
 * @param data - Data to send
 */
export const successResponse = (res, data = null, message = "Success", statusCode = 200) => {
    return res.status(statusCode).json({message: message, success: true, data})
}

/**
 * @param res - Express response object
 * @param statusCode - HTTP status code (default 500)
 * @param message - Optional message
 * @param error - Optional error message
 */
export const errorResponse = (res, message = "Internal Server Error", statusCode = 500, error = null) => {
    // CLG if in development
    if (process.env.NODE_ENV === "development") {
        console.log(error)
    }
    return res.status(statusCode).json({message: message, success: false, error})
}