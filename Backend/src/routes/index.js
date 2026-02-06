import express from 'express';
import authRouter from './authRoutes.js'
import userRouter from './userRoutes.js'
import teamRouter from './teamRoutes.js'

const router = express.Router();

router.use('/auth', authRouter);
router.use('/users', userRouter);
router.use('/teams', teamRouter);

export default router;