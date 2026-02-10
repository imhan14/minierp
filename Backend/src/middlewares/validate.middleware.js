export const validate = (schema) => (req, res, next) => {
    const { error, value } = schema.validate(req.body, { 
        abortEarly: false, 
        stripUnknown: true 
    });

    if (error) {
        const errorMessage = error.details.map(d => d.message).join(', ');

        const err = new Error(errorMessage);
        err.statusCode = 400; 
        return next(err); 
    }

    req.body = value;
    next();
};