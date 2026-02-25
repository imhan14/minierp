import express from 'express'
import { createProductReport, deleteProductReport, getProductReport, updateProductReport } from "../controllers/productReportController";
import { validate } from '../middlewares/validate.middleware';
import { createProductReportSchema, updateProductReportSchema } from '../validations/productReport.validation';
import { authenticate } from '../middlewares/authMiddleware';

const router = express.Router();

router.post('/', validate(createProductReportSchema), authenticate, createProductReport);
router.get('/', authenticate, getProductReport);
router.patch('/:id', validate(updateProductReportSchema), authenticate, updateProductReport);
router.delete('/:id', authenticate, deleteProductReport);

export default router;