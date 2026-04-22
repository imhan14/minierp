import Joi from "joi";

export const createRoleSchema = Joi.object({
    role_name: Joi.string().min(3).max(100).required(),
    priority_level: Joi.number().integer().min(0).required()
});

export const updateRoleSchema = Joi.object({
    role_name: Joi.string().min(3).max(100).optional(),
    priority_level: Joi.number().integer().min(0).optional()
});