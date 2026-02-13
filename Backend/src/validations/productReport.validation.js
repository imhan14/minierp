const JoiBase = require('joi');
const JoiDate = require('@joi/date');
const Joi = JoiBase.extend(JoiDate);

export const createProductReportSchema = Joi.object({
    report_date: Joi.date().format('DD-MM-YYYY').required(),
    team_id: Joi.number().integer().min(1).required(),
    furnance: Joi.number().integer().min(1).optional(),
    shift: Joi.string().required(),
    start_time: Joi.date().format('HH:mm:ss').optional(),
    end_time: Joi.date().format('HH:mm:ss').greater(Joi.ref('start_time')).optional().messages({
            'date.greater': 'Giờ kết thúc phải lớn hơn giờ bắt đầu'
        })
});

export const updateProductReportSchema = Joi.object({
        report_date: Joi.date().format('DD-MM-YYYY').optional(),
    team_id: Joi.number().integer().min(1).optional(),
    furnance: Joi.number().integer().min(1).optional(),
    shift: Joi.string().optional(),
    start_time: Joi.date().format('HH:mm:ss').optional(),
    end_time: Joi.date().format('HH:mm:ss').greater(Joi.ref('start_time')).optional().messages({
            'date.greater': 'Giờ kết thúc phải lớn hơn giờ bắt đầu'
        })
});