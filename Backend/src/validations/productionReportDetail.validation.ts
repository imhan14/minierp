const JoiBase = require("joi");
const JoiDate = require("@joi/date");
const Joi = JoiBase.extend(JoiDate);

export const createProductionReportDetailSchema = Joi.object({
  product_id: Joi.number().integer().min(1).required(),
  report_id: Joi.number().integer().min(1).required(),
  is_finish: Joi.boolean().optional(),
  type_of_specification: Joi.string().optional(),
  product_line: Joi.string().optional(),
  specification: Joi.string().optional(),
  weight: Joi.number().optional(),
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
  note: Joi.string().optional(),
});

export const updateProductionReportDetailSchema = Joi.object({
  product_id: Joi.number().integer().min(1).required(),
  report_id: Joi.number().integer().min(1).required(),
  is_finish: Joi.boolean().optional(),
  type_of_specification: Joi.string().optional(),
  product_line: Joi.string().optional(),
  specification: Joi.string().optional(),
  weight: Joi.number().optional(),
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
  note: Joi.string().optional(),
});
