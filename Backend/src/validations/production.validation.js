import Joi from 'joi';

export const createProductionSchema = Joi.object({
    product_code: Joi.number().integer().min(1).required(),
    product_name: Joi.string().min(3).required(),
    unit: Joi.string().min(3).max(100).required(),
    description: Joi.string().optional()
});

export const updateProductionSchema = Joi.object({
    product_code: Joi.number().integer().min(1).optional(),
    product_name: Joi.string().min(3).optional(),
    unit: Joi.string().min(3).max(100).optional(),
    description: Joi.string().optional()
});