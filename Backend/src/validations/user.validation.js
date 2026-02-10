import Joi from 'joi';

export const createUserschema = Joi.object({
    username: Joi.string().min(1).max(100).required(),
    password: Joi.string().min(8).max(16).required(),
    full_name: Joi.string().min(1).max(100).required(),
    role_id: Joi.number().min(0).max(5),
});

export const updateUserSchema = Joi.object({
    full_name: Joi.string().optional(),
    password: Joi.string().min(8).optional(),
    role_id: Joi.number().optional(),
    is_active: Joi.boolean().optional()
}).min(1);