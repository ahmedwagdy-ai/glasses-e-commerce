const Joi = require('joi');

const createCategorySchema = Joi.object({
    name: Joi.string().required().messages({
        'string.empty': 'Name cannot be empty',
        'any.required': 'Name is a required field',
    }),
    description: Joi.string().optional(),
    image: Joi.object({
        url: Joi.string().required(),
        public_id: Joi.string().required()
    }).optional()
});

const updateCategorySchema = Joi.object({
    name: Joi.string().optional(),
    description: Joi.string().optional(),
    image: Joi.object({
        url: Joi.string().required(),
        public_id: Joi.string().required()
    }).optional()
});

module.exports = {
    createCategorySchema,
    updateCategorySchema,
};
