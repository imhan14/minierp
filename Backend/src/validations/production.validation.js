import Joi from 'joi';
import { UNIT } from '../utils/unit.constant.js';

export const createProductionSchema = Joi.object({
    product_code: Joi.string().min(1).required(),
    product_name: Joi.string().min(3).required(),
    unit: Joi.string().valid(...Object.values(UNIT)).required(),
    description: Joi.string().optional()
});

export const updateProductionSchema = Joi.object({
    product_code: Joi.string().min(1).optional(),
    product_name: Joi.string().min(3).optional(),
    unit: Joi.string().valid(...Object.values(UNIT)).optional(),
    description: Joi.string().optional()
});