const Joi = require('joi');

const createOrderSchema = Joi.object({
    // Support for multiple items
    items: Joi.array().items(
        Joi.object({
            product: Joi.string().required(),
            quantity: Joi.number().min(1).default(1)
        })
    ).optional(),

    // Legacy single item support (optional now, but one of them is needed)
    product: Joi.string().optional(),
    quantity: Joi.number().optional().min(1).default(1),
    address: Joi.string().required(),
    paymentMethod: Joi.string().valid('cash').default('cash'),
    customerName: Joi.string().optional(),
    phone: Joi.string().optional(),
    // Legacy support or if we want to allow cart checkout later, we could use alternatives, 
    // but user specifically asked to "remove items".
    billingData: Joi.object().optional(),
});

module.exports = {
    createOrderSchema,
};
