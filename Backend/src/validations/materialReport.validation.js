const JoiBase = require("joi");
const JoiDate = require("@joi/date");
const Joi = JoiBase.extend(JoiDate);

const extraMaterialItemSchema = Joi.object({
  ingredient_name: Joi.string().allow("", null),
  weight: Joi.number().allow(null),
  real_percent: Joi.number().min(0).max(100).allow(null),
  note: Joi.string().allow("", null),
}).unknown(true);
const materialDetailSchema = Joi.object({
  ingredient_id: Joi.number().integer().required(),
  weight: Joi.number().precision(2).positive().required(),
  real_percent: Joi.number().min(0).max(100).allow(null),
  note: Joi.string().allow("", null),
});

export const createMaterialReportSchema = Joi.object({
  report_date: Joi.date().required(),
  team_id: Joi.number().integer().min(1).required(),
  shift: Joi.string().optional(),
  start_time: Joi.date().format("DD-MM-YYYY HH:mm").optional().messages({
    "date.format": "Giờ bắt đầu phải đúng định dạng DD-MM-YYYY HH:mm",
  }),
  end_time: Joi.date()
    .format("DD-MM-YYYY HH:mm")
    .greater(Joi.ref("start_time"))
    .optional()
    .messages({
      "date.format": "Giờ kết thúc phải đúng định dạng DD-MM-YYYY HH:mm",
      "date.greater": "Giờ kết thúc phải lớn hơn giờ bắt đầu",
    }),
  extral_materials: Joi.array()
    .items(extraMaterialItemSchema)
    .allow(null)
    .default([]),
  foreman_check: Joi.boolean().default(false),
  details: Joi.array().items(materialDetailSchema).min(1).optional(),
});

export const updateMaterialReportSchema = Joi.object({
  report_date: Joi.date().optional(),
  team_id: Joi.number().integer().min(1).optional(),
  shift: Joi.string().optional(),
  start_time: Joi.date().format("DD-MM-YYYY HH:mm").optional().messages({
    "date.format": "Giờ bắt đầu phải đúng định dạng DD-MM-YYYY HH:mm",
  }),
  end_time: Joi.date()
    .format("DD-MM-YYYY HH:mm")
    .greater(Joi.ref("start_time"))
    .optional()
    .messages({
      "date.format": "Giờ kết thúc phải đúng định dạng DD-MM-YYYY HH:mm",
      "date.greater": "Giờ kết thúc phải lớn hơn giờ bắt đầu",
    }),
  extral_materials: Joi.array()
    .items(extraMaterialItemSchema)
    .allow(null)
    .default([]),
  foreman_check: Joi.boolean().default(false).optional(),
  details: Joi.array().items(materialDetailSchema).min(1).optional(),
});
