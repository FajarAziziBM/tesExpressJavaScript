const Joi = require('joi');

module.exports.placeSchema = Joi.object({
    place: Joi.object({
        rating: Joi.number().required().min(1).max(5),
        body: Joi.string().required()   
    }).required()
});