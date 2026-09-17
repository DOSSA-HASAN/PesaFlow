export const globalErrorHandler = (err, req, res, next) => {

    const statusCode = err?.statusCode || 500

    res.status(statusCode || 500).json({
        success: false,
        message: `Global error handler message - ${err.message} - ${err.stack}` || "Internal server error"
    })
}