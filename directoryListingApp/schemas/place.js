
const Joi = require("joi");

const placeSchema = Joi.object({
    title: Joi.string().required(),
    price: Joi.number().min(0).required(),
    description: Joi.string().required(),
    location: Joi.string().required(),
    image: Joi.string().uri().allow("", null)
});

module.exports = placeSchema;   
