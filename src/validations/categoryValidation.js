const Joi = require('joi');

const createCategorySchema = Joi.object({
    name: Joi.object({
        en: Joi.string().required(),
        ar: Joi.string().required()
    }).required(),
    description: Joi.object({
        en: Joi.string().optional(),
        ar: Joi.string().optional()
    }).optional(),
    image: Joi.object({
        url: Joi.string().required(),
        public_id: Joi.string().required()
    }).optional()
});

const updateCategorySchema = Joi.object({
    name: Joi.object({
        en: Joi.string().optional(),
        ar: Joi.string().optional()
    }).optional(),
    description: Joi.object({
        en: Joi.string().optional(),
        ar: Joi.string().optional()
    }).optional(),
    image: Joi.object({
        url: Joi.string().required(),
        public_id: Joi.string().required()
    }).optional()
});

module.exports = {
    createCategorySchema,
    updateCategorySchema,
};
