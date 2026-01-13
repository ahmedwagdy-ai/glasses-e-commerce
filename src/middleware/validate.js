const validate = (schema) => (req, res, next) => {
    const { error, value } = schema.validate(req.body, { abortEarly: false });

    if (error) {
        const errorMessage = error.details.map((detail) => detail.message).join(', ');
        res.status(400);
        throw new Error(errorMessage);
    }

    req.body = value;
    next();
};

module.exports = validate;
