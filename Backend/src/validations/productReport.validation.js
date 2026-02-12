import Joi from "joi";

export const createProductReportSchema = Joi.object({
    report_date: Joi.date().format('DD-MM-YYYY').required(),
    team_id: Joi.number().integer().min(1).required(),
    furnance: Joi.number().integer().min(1).optional(),
    shift: Joi.string().required(),
    start_time: Joi.string().regex(/^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/).optional(),
    end_time: Joi.string().regex(/^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/).optional()
});

export const updateProductReportSchema = Joi.object({
        report_date: Joi.date().format('DD-MM-YYYY').optional(),
    team_id: Joi.number().integer().min(1).optional(),
    furnance: Joi.number().integer().min(1).optional(),
    shift: Joi.string().optional(),
    start_time: Joi.string().regex(/^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/).optional(),
    end_time: Joi.string().regex(/^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/).greater(Joi.ref('start_time')).optional()
});