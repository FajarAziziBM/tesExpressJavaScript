const placeSchema = require('../schemas/place');
const reviewSchema = require('../schemas/review');

module.exports.validatePlace = (req, res, next) => {
    const { error } = placeSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        const errObj = new Error(msg);
        errObj.statusCode = 400;
        return next(errObj);
    }
    next();
};

module.exports.validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        const errObj = new Error(msg);
        errObj.statusCode = 400;
        return next(errObj);
    }
    next();
};
