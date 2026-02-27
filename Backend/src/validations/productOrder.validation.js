const JoiBase = require('joi');
const JoiDate = require('@joi/date');
const Joi = JoiBase.extend(JoiDate);

export const createProductOrderSchema = Joi.object({
    order_date: Joi.date().format('DD-MM-YYYY').required().messages({
        'date.format': 'Ngày báo cáo phải đúng định dạng DD-MM-YYYY'
    }),
    formula_id: Joi.number().integer().min(1).required(),
    team_id: Joi.number().integer().min(1).required(), 
    product_shift: Joi.string().required(),
    target_quantity: Joi.number().optional(),
    urea_rate: Joi.number().optional(),
    input_temprature_1: Joi.number().integer().min(1).optional(), 
    output_temprature_1: Joi.number().integer().min(1).optional(), 
    input_temprature_2: Joi.number().integer().min(1).optional(), 
    output_temprature_2: Joi.number().integer().min(1).optional(), 
    order_note: Joi.string().optional()
});

export const updateProductOrderSchema = Joi.object({
    team_id: Joi.number().integer().min(1).optional(), 
    product_shift: Joi.string().optional(),
    status: Joi.string().optional(),
    input_temprature_1: Joi.number().integer().min(1).optional(), 
    output_temprature_1: Joi.number().integer().min(1).optional(), 
    input_temprature_2: Joi.number().integer().min(1).optional(), 
    output_temprature_2: Joi.number().integer().min(1).optional(), 
    order_note: Joi.string().optional()
});