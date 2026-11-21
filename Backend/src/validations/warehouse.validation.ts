import Joi from "joi";

export const createWarehouseTransactionSchema = Joi.object({
  product_type: Joi.string().trim().min(1).max(100).required(),
  transaction_type: Joi.string().valid("inbound", "outbound").required(),
  quantity: Joi.number().positive().required(),
  note: Joi.string().allow("", null).optional(),
});
