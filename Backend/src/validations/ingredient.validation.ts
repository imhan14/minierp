import Joi from "joi";

export const createIngredientSchema = Joi.object({
  ingredient_code: Joi.string().required(),
  ingredient_name: Joi.string().required(),
  unit: Joi.string().required(),
  description: Joi.string().allow("").optional(),
});

export const updateIngredientSchema = Joi.object({
  ingredient_code: Joi.string().optional(),
  ingredient_name: Joi.string().optional(),
  unit: Joi.string().optional(),
  description: Joi.string().optional(),
});
