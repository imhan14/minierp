import Joi from 'joi';

export const updateIngredientSchema = Joi.object({
    ingredient_name: Joi.string().min(2).max(100),
    // unit: Joi.string(),
    // price: Joi.number().positive(),
});