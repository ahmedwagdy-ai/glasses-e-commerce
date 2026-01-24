const Joi = require('joi');

const createProductSchema = Joi.object({
    name: Joi.string().required(),
    description: Joi.object({
        en: Joi.string().required(),
        ar: Joi.string().required()
    }).required(),
    price: Joi.number().required().min(0),
    priceBeforeDiscount: Joi.number().min(0).default(0)
        .when('price', {
            is: Joi.exist(),
            then: Joi.number().allow(0).greater(Joi.ref('price'))
        }),
    shippingPrice: Joi.number().min(0).default(0),
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
    description: Joi.object({
        en: Joi.string().optional(),
        ar: Joi.string().optional()
    }).optional(),
    price: Joi.number().min(0).optional(),
    priceBeforeDiscount: Joi.number().min(0).optional(),
    shippingPrice: Joi.number().min(0).optional(),
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

const reviewSchema = Joi.object({
    rating: Joi.number().required().min(1).max(5),
    comment: Joi.string().required(),
});

module.exports = {
    createProductSchema,
    updateProductSchema,
    reviewSchema
};
