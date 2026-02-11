import Joi from 'joi';

export const createUserschema = Joi.object({
    username: Joi.string().min(1).max(100).required(),
    password: Joi.string().min(8).max(16).required(),
    full_name: Joi.string().min(1).max(100).required(),
    role_id: Joi.number().integer().min(0).required(),
});

export const updateUserSchema = Joi.object({
    full_name: Joi.string().optional(),
    old_password: Joi.string().optional(),
    new_password: Joi.string()
        .min(8)
        .invalid(Joi.ref('old_password'))
        .optional()
        .messages({
            'any.invalid': 'The new password must be different from the old password'
        }),
    confirm_password: Joi.string().valid(Joi.ref('new_password')).optional(),
    role_id: Joi.number().integer().optional(),
    is_active: Joi.boolean().optional()
}).min(1);