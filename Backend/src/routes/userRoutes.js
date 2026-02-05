import express from 'express';
import {createUser, deleteUser, getAUser, getUsers, updateUser} from '../controllers/userController.js'
import { authenticate } from '../middlewares/authMiddleware.js';
const router = express.Router();

router.get('/', authenticate, getUsers);
router.get('/:id', authenticate, getAUser);
router.post('/', authenticate, createUser);
router.patch('/:id', authenticate, updateUser);
router.delete('/:id', authenticate, deleteUser);

export default router;