import Joi from "joi";

export const updateGeneralSchema = Joi.object({
  start_time: Joi.date()
    .required()
    .messages({
      "date.base": "Thời gian bắt đầu không hợp lệ",
      "any.required": "Vui lòng chọn thời gian bắt đầu",
    })
    .allow(null),
  end_time: Joi.date()
    .greater(Joi.ref("start_time"))
    .required()
    .messages({
      "date.base": "Thời gian kết thúc không hợp lệ",
      "date.greater": "Thời gian kết thúc phải lớn hơn thời gian bắt đầu",
      "any.required": "Vui lòng chọn thời gian kết thúc",
    })
    .allow(null),
  furnace: Joi.any().optional().allow(null),
  shift: Joi.any().optional().allow(null),
});
