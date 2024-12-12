const errorHandler = (err, req, res, next) => {
    console.error('🔴 Error:', err);

    const statusCode = err.status || 500;
    res.status(statusCode).render('pages/error', {
        title: 'Terjadi Kesalahan',
        error: {
            status: statusCode,
            message: err.message || 'Terjadi Kesalahan Server',
            stack: process.env.NODE_ENV === 'development' ? err.stack : null
        }
    });
};

module.exports = errorHandler;