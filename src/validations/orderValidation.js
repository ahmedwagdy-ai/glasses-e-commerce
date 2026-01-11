const Joi = require('joi');

const createOrderSchema = Joi.object({
    customerName: Joi.string().required(),
    address: Joi.string().required(),
    paymentMethod: Joi.string().valid('card', 'wallet', 'cash').required(),
    items: Joi.array().items(
        Joi.object({
            product: Joi.string().required(), // ObjectId
            qty: Joi.number().required().min(1),
            price: Joi.number().required().min(0),
        })
    ).required().min(1),
    totalAmount: Joi.number().required().min(0),
    // Optional billing data structure if strictly required by Paymob controller logic
    billingData: Joi.object().optional(),
});

module.exports = {
    createOrderSchema,
};
