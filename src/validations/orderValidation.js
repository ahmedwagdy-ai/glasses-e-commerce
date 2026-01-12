const Joi = require('joi');

const createOrderSchema = Joi.object({
    product: Joi.string().required(), // Direct Product ID
    quantity: Joi.number().optional().min(1).default(1),
    address: Joi.string().required(),
    paymentMethod: Joi.string().valid('cash').default('cash'),
    // Legacy support or if we want to allow cart checkout later, we could use alternatives, 
    // but user specifically asked to "remove items".
    billingData: Joi.object().optional(),
});

module.exports = {
    createOrderSchema,
};
