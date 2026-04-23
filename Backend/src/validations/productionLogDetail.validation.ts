const JoiBase = require("joi");
const JoiDate = require("@joi/date");
const Joi = JoiBase.extend(JoiDate);

export const createProductLogDetailSchema = Joi.object({
  production_log_id: Joi.number().integer().min(1).optional(),
  start_time: Joi.date()
    .format("DD-MM-YYYY HH:mm")
    .optional()
    .messages({
      "date.base": "Thời gian bắt đầu không hợp lệ",
      "any.required": "Vui lòng chọn thời gian bắt đầu",
    })
    .allow(null),
  end_time: Joi.date()
    .format("DD-MM-YYYY HH:mm")
    .greater(Joi.ref("start_time"))
    .optional()
    .messages({
      "date.base": "Thời gian kết thúc không hợp lệ",
      "date.greater": "Thời gian kết thúc phải lớn hơn thời gian bắt đầu",
      "any.required": "Vui lòng chọn thời gian kết thúc",
    })
    .allow(null),
  task_type: Joi.string().optional().allow(null),
  content: Joi.string().optional().allow(null),
  quantity: Joi.number().optional().allow(null),
  product_type: Joi.string().optional().allow(null),
  pkg_received: Joi.number().optional().allow(null),
  pkg_returned: Joi.number().optional().allow(null),
  pkg_damaged: Joi.number().optional().allow(null),
});

export const updateProductLogDetailSchema = Joi.object({
  production_log_id: Joi.number().integer().min(1).optional(),
  start_time: Joi.date()
    .format("DD-MM-YYYY HH:mm")
    .optional()
    .messages({
      "date.base": "Thời gian bắt đầu không hợp lệ",
      "any.required": "Vui lòng chọn thời gian bắt đầu",
    })
    .allow(null),
  end_time: Joi.date()
    .format("DD-MM-YYYY HH:mm")
    .greater(Joi.ref("start_time"))
    .optional()
    .messages({
      "date.base": "Thời gian kết thúc không hợp lệ",
      "date.greater": "Thời gian kết thúc phải lớn hơn thời gian bắt đầu",
      "any.required": "Vui lòng chọn thời gian kết thúc",
    })
    .allow(null),
  task_type: Joi.string().optional().allow(null),
  content: Joi.string().optional().allow(null),
  quantity: Joi.number().optional().allow(null),
  product_type: Joi.string().optional().allow(null),
  pkg_received: Joi.number().optional().allow(null),
  pkg_returned: Joi.number().optional().allow(null),
  pkg_damaged: Joi.number().optional().allow(null),
});
