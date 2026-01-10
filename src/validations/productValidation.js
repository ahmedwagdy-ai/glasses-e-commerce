const Joi = require('joi');

const createProductSchema = Joi.object({
    name: Joi.string().required(),
    description: Joi.string().required(),
    price: Joi.number().required().min(0),
    category: Joi.string().required(), // Expecting ObjectId as string
    colors: Joi.array().items(
        Joi.object({
            name: Joi.string().required(),
            image: Joi.object({
                url: Joi.string().required(),
                public_id: Joi.string().required()
            }).required()
        })
    ).optional(),
    countInStock: Joi.number().required().min(0).default(0),
});

const updateProductSchema = Joi.object({
    name: Joi.string().optional(),
    description: Joi.string().optional(),
    price: Joi.number().min(0).optional(),
    category: Joi.string().optional(),
    colors: Joi.array().items(
        Joi.object({
            name: Joi.string().required(),
            image: Joi.object({
                url: Joi.string().required(),
                public_id: Joi.string().required()
            }).required()
        })
    ).optional(),
    countInStock: Joi.number().min(0).optional(),
});

module.exports = {
    createProductSchema,
    updateProductSchema,
};
