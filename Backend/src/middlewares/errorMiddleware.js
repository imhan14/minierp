export const globalErrorHandler = (err, req, res, next) => {
    console.error('--- PRISMA ERROR DEBUG ---', JSON.stringify(err, null, 2));
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    if (err.code === 'P2002') {
        err.statusCode = 409;
        const field = err.meta?.target ? err.meta.target.join(', ') : 'Data field';
        err.message = `${field} already exist.`;
    }
    
    if (err.code === 'P2025') {
        err.statusCode = 404;
        err.message = 'No data found.';
    }

    res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
        target: err.meta?.target,
        // development
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    });
};