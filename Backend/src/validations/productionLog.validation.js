const JoiBase = require("joi");
const JoiDate = require("@joi/date");
const Joi = JoiBase.extend(JoiDate);

export const createProductLogSchema = Joi.object({
  log_date: Joi.date().required(),
  team_id: Joi.number().integer().min(1).required(),
});

export const updateProductLogSchema = Joi.object({
  log_start: Joi.date()
    .format("DD-MM-YYYY HH:mm")
    .optional()
    .messages({
      "date.base": "Thời gian bắt đầu không hợp lệ",
      "any.required": "Vui lòng chọn thời gian bắt đầu",
    })
    .allow(null),
  log_end: Joi.date()
    .format("DD-MM-YYYY HH:mm")
    .greater(Joi.ref("log_start"))
    .optional()
    .messages({
      "date.base": "Thời gian kết thúc không hợp lệ",
      "date.greater": "Thời gian kết thúc phải lớn hơn thời gian bắt đầu",
      "any.required": "Vui lòng chọn thời gian kết thúc",
    })
    .allow(null),
  electric_production: Joi.number().optional().allow(null),
  electric_mix: Joi.number().optional().allow(null),
  number_of_employee: Joi.number().optional().allow(null),
  on_work: Joi.number().optional().allow(null),
  unauthorized_absence: Joi.string().optional().allow(null),
  authorized_absence: Joi.string().optional().allow(null),
  ht_di: Joi.string().optional().allow(null),
  ht_den: Joi.string().optional().allow(null),
  forklift: Joi.string().optional().allow(null),
  shift_leader: Joi.string().optional().allow(null),
});
