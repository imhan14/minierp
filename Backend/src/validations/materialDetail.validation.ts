import Joi from "joi";

const detailItemSchema = Joi.object({
  material_id: Joi.number().integer().required(),
  ingredient_id: Joi.number().integer().required(),
  weight: Joi.number().positive().required(),
  real_percent: Joi.number().min(0).max(100).allow(null),
  note: Joi.string().allow("", null),
});

export const bulkDetailsSchema = Joi.array()
  .items(detailItemSchema)
  .min(1)
  .messages({
    "array.min": "Bạn phải nhập ít nhất một dòng nguyên liệu",
  });
export const updateMaterialDetailSchema = Joi.object({
  weight: Joi.number().positive().optional(),
  real_percent: Joi.number().min(0).max(100).allow(null).optional(),
  note: Joi.string().allow("", null).optional(),
});
