const Joi = require('joi');

const registerUserSchema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().required().min(6),
    avatar: Joi.object({
        url: Joi.string().required(),
        public_id: Joi.string().required()
    }).optional()
});

const loginUserSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
});

const updateUserProfileSchema = Joi.object({
    name: Joi.string().optional(),
    email: Joi.string().email().optional(),
    password: Joi.string().min(6).optional(),
    avatar: Joi.object({
        url: Joi.string().required(),
        public_id: Joi.string().required()
    }).optional()
});

module.exports = {
    registerUserSchema,
    loginUserSchema,
    updateUserProfileSchema,
};
