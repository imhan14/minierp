const JoiBase = require('joi');
const JoiDate = require('@joi/date');
const Joi = JoiBase.extend(JoiDate);

export const createProductReportSchema = Joi.object({
    report_date: Joi.date().format('DD-MM-YYYY').required().messages({
        'date.format': 'Ngày báo cáo phải đúng định dạng DD-MM-YYYY'
    }),
    team_id: Joi.number().integer().min(1).required(),
    furnace: Joi.number().integer().min(1).optional(), 
    shift: Joi.string().required(),
    start_time: Joi.date().format('DD-MM-YYYY HH:mm').optional().messages({
        'date.format': 'Giờ bắt đầu phải đúng định dạng DD-MM-YYYY HH:mm'
    }),
    end_time: Joi.date().format('DD-MM-YYYY HH:mm').greater(Joi.ref('start_time')).optional().messages({
        'date.format': 'Giờ kết thúc phải đúng định dạng DD-MM-YYYY HH:mm',
        'date.greater': 'Giờ kết thúc phải lớn hơn giờ bắt đầu'
    })
});

export const updateProductReportSchema = Joi.object({
    report_date: Joi.date().format('DD-MM-YYYY').optional().messages({
        'date.format': 'Ngày báo cáo phải đúng định dạng DD-MM-YYYY'
    }),
    team_id: Joi.number().integer().min(1).optional(),
    furnace: Joi.number().integer().min(1).optional(), 
    shift: Joi.string().optional(),
    start_time: Joi.date().format('DD-MM-YYYY HH:mm').optional().messages({
        'date.format': 'Giờ bắt đầu phải đúng định dạng DD-MM-YYYY HH:mm'
    }),
    end_time: Joi.date().format('DD-MM-YYYY HH:mm').greater(Joi.ref('start_time')).optional().messages({
        'date.format': 'Giờ kết thúc phải đúng định dạng DD-MM-YYYY HH:mm',
        'date.greater': 'Giờ kết thúc phải lớn hơn giờ bắt đầu'
    })
});