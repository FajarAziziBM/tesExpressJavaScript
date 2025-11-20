// middleware/validation.js
const placeSchema = require("../schemas/place");
const reviewSchema = require("../schemas/review");

// console.log("DEBUG placeSchema:", placeSchema); 

module.exports.validatePlace = (req, res, next) => {
    const { error } = placeSchema.validate(req.body, { abortEarly: false });

    if (error) {
        const errors = {};

        error.details.forEach(detail => {
            errors[detail.path[0]] = detail.message;
        });

        return res.status(400).render("pages/places/create", {
            errors,
            formData: req.body
        });
    }

    next();
};

module.exports.validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body.review, { abortEarly: false });

    if (error) {
        const errors = {};

        error.details.forEach(detail => {
            errors[detail.path[0]] = detail.message;
        });

        req.validationErrors = errors;

        return res.status(400).render("pages/places/show", {
            errors,
            place: req.place,
            formData: req.body.review,
            showReviewForm: true
        });
    }

    next();
};
