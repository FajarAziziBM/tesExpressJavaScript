module.exports = (req, res, next) => {
    // Set current page
    const pathSegments = req.path.split('/');
    res.locals.currentPage = pathSegments[1] || 'home';

    // Flash messages
    res.locals.successMessage = req.flash('success');
    res.locals.errorMessage = req.flash('error');

    // Optional: User authentication
    res.locals.currentUser = req.user || null;

    next();
};