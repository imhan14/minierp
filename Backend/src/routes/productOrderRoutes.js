import express from 'express'
import { authenticate } from '../middlewares/authMiddleware';
import { validate } from '../middlewares/validate.middleware';
import { cancelProductOrder, confirmProductOrder, createProductOrder, getProductOrder, updateProductOrder } from "../controllers/productOrderController";
import { createProductOrderSchema, updateProductOrderSchema } from '../validations/productOrder.validation';

const router = express.Router();

router.get('/', authenticate, getProductOrder)
router.post('/', validate(createProductOrderSchema), authenticate, createProductOrder);
router.patch('/:id', validate(updateProductOrderSchema), authenticate, updateProductOrder);
router.patch('/:id/confirm', authenticate, confirmProductOrder);
router.patch('/:id/cancel', authenticate, cancelProductOrder);

export default router;