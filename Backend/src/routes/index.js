import express from 'express';
import authRouter from './authRoutes.js'
import userRouter from './userRoutes.js'
import teamRouter from './teamRoutes.js'
import productRouter from './productRoutes.js'
import roleRouter from './roleRoutes.js'
import productReportRouter from './productReportRoutes.js'
import productOrderRouter from './productOrderRoutes.js'
import ingredientRouter from './ingredientRoutes.js'
import formulaDetailRouter from './formulaDetailRoutes.js'

const router = express.Router();

router.use('/auth', authRouter);
router.use('/users', userRouter);
router.use('/teams', teamRouter);
router.use('/product', productRouter);
router.use('/role', roleRouter);
router.use('/ingredient', ingredientRouter)
router.use('/product-report', productReportRouter);
router.use('/product-order', productOrderRouter);
router.use('/formula-detail', formulaDetailRouter);

export default router;