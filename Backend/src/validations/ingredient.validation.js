import Joi from 'joi';

export const createIngredientSchema = Joi.object({
    ingredient_code: Joi.string().min(2).max(100).required(),
    ingredient_name: Joi.string().min(1).required(),
    unit: Joi.string().min(1).required(),
    description: Joi.string().optional(),
});

export const updateIngredientSchema = Joi.object({
    ingredient_code: Joi.string().min(2).max(100).optional(),
    ingredient_name: Joi.string().min(1).optional(),
    unit: Joi.string().min(1).optional(),
    description: Joi.string().optional(),
});