import express from 'express'
import {createProduct, deleteProduct, getProducts, updateProduct} from '../controllers/productController.js'
import { authenticate } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/', authenticate, getProducts);
router.post('/', authenticate, createProduct);
router.patch('/', authenticate, updateProduct);
router.delete('/', authenticate, deleteProduct);

export default router;