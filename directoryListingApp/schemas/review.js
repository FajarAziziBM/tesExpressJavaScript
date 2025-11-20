
const Joi = require("joi");

const reviewSchema = Joi.object({
    rating: Joi.number().min(1).max(5).required(),
    body: Joi.string().min(5).required()
});

module.exports = reviewSchema;
