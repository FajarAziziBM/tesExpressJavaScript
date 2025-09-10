module.exports = (req, res, next) => {
    // Set current page
    const pathSegments = req.path.split('/');
    res.locals.currentPage = pathSegments[1] || 'home';

    // Optional: User authentication
    res.locals.currentUser = req.user || null;

    next();
};