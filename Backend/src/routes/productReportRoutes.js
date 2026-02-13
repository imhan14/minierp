import express from 'express'
import { createProductReport } from "../controllers/productReportController";
import { validate } from '../middlewares/validate.middleware';
import { createProductReportSchema } from '../validations/productReport.validation';
import { authenticate } from '../middlewares/authMiddleware';

const router = express.Router();

router.post('/', validate(createProductReportSchema), authenticate, createProductReport);

export default router;