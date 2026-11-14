const JoiBase = require("joi");
const JoiDate = require("@joi/date");
const Joi = JoiBase.extend(JoiDate);

export const createProductOrderSchema = Joi.object({
  order_date: Joi.date().required().messages({
    "date.format": "Ngày báo cáo phải đúng định dạng DD-MM-YYYY",
  }),
  formula_id: Joi.number().integer().min(1).required(),
  team_id: Joi.number().integer().min(1).required(),
  product_shift: Joi.string()
    .valid("C1x8", "C1x12", "C2x8", "C2x12", "C3x8")
    .required(),
  target_quantity: Joi.number().positive().required(),
  urea_rate: Joi.number().optional(),
  input_temprature_1: Joi.number().integer().min(1).optional(),
  output_temprature_1: Joi.number().integer().min(1).optional(),
  input_temprature_2: Joi.number().integer().min(1).optional(),
  output_temprature_2: Joi.number().integer().min(1).optional(),
  order_note: Joi.string().optional(),
});

export const updateProductOrderSchema = Joi.object({
  order_date: Joi.date().optional(),
  team_id: Joi.number().integer().min(1).optional(),
  formula_id: Joi.number().integer().min(1).optional(),
  product_shift: Joi.string().optional(),
  status: Joi.string().valid("pending", "ok", "cancel").optional(),
  target_quantity: Joi.number().integer().optional(),
  urea_rate: Joi.number().integer().optional(),
  input_temprature_1: Joi.number().integer().min(1).optional(),
  output_temprature_1: Joi.number().integer().min(1).optional(),
  input_temprature_2: Joi.number().integer().min(1).optional(),
  output_temprature_2: Joi.number().integer().min(1).optional(),
  order_note: Joi.string().optional(),
});
