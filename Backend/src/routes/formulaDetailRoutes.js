import express from 'express';
import {getFormulaDetail}  from '../controllers/formulaDetailController'
import { authenticate } from '../middlewares/authMiddleware';

const router = express.Router();

router.get('/', authenticate, getFormulaDetail);

export default router;