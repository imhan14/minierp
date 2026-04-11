import BaseJoi from "joi";
import JoiDate from "@joi/date";
const Joi = BaseJoi.extend(JoiDate);

export const orderValidateSchema = Joi.object({
  order_date: Joi.date().optional().messages({
    "date.base": "Ngày không hợp lệ",
    "any.required": "Vui lòng chọn ngày",
  }),
  formula_id: Joi.number()
    .optional()
    .messages({ "number.base": "Formula ID must be a number" })
    .allow(null),
  team_id: Joi.number()
    .optional()
    .messages({ "number.base": "Team ID must be a number" }),
  product_shift: Joi.string().optional().allow(null),
  target_quantity: Joi.number().optional().allow(null),
  urea_rate: Joi.number().optional().allow(null),
  status: Joi.string().optional().allow(null),
  input_temprature_1: Joi.number().optional().allow(null),
  input_temprature_2: Joi.number().optional().allow(null),
  output_temprature_1: Joi.number().optional().allow(null),
  output_temprature_2: Joi.number().optional().allow(null),
  order_note: Joi.string().optional().allow(null),
  created_by: Joi.string().optional().allow(null),
});
