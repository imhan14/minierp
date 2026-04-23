import Joi from "joi";

export const createFormulaDetailSchema = Joi.object({
  formula_id: Joi.number().min(1).required(),
  ingredient_id: Joi.number().min(1).required(),
  standard_quality: Joi.number().min(1).required(),
});

export const updateFormulaDetailSchema = Joi.object({
  formula_id: Joi.number().min(1).optional(),
  ingredient_id: Joi.number().min(1).optional(),
  standard_quality: Joi.number().min(1).optional(),
});
