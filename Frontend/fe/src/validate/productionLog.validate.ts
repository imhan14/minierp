import Joi from "joi";

export const updateProductLogGeneralSchema = Joi.object({
  log_start: Joi.date()
    .optional()
    .messages({
      "date.base": "Thời gian bắt đầu không hợp lệ",
      "any.required": "Vui lòng chọn thời gian bắt đầu",
    })
    .allow(null),
  log_end: Joi.date()
    .greater(Joi.ref("start_time"))
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
  authorized_absence: Joi.number().optional().allow(null),
  ht_di: Joi.string().optional().allow(null),
  ht_den: Joi.string().optional().allow(null),
  forklift: Joi.string().optional().allow(null),
  shift_leader: Joi.string().optional().allow(null),
});
