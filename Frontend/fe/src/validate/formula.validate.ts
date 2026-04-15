import BaseJoi from "joi";
import JoiDate from "@joi/date";
const Joi = BaseJoi.extend(JoiDate);

export const formulaValidateSchema = Joi.object({
  formula_code: Joi.string().optional(),
  formula_name: Joi.string().optional().allow(null),
  product_id: Joi.number()
    .optional()
    .messages({ "number.base": "Product ID must be a number" }),
  is_active: Joi.boolean().optional().allow(null),
  product_line: Joi.string().optional().allow(null),
  specification: Joi.string().optional().allow(null),
  color: Joi.string().optional().allow(null),
  type_of_specification: Joi.string().optional().allow(null),
  created_by: Joi.number().optional().allow(null),
});
