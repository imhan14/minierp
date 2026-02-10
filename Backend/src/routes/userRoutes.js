import express from 'express';
import {createUser, deleteUser, getAUser, getUsers, updateUser} from '../controllers/userController.js'
import { authenticate } from '../middlewares/authMiddleware.js';
import { validate } from "../middlewares/validate.middleware";
import {createUserschema} from '../validations/user.validation.js'
const router = express.Router();

router.get('/', authenticate, getUsers);
router.get('/:id', authenticate, getAUser);
router.post('/', validate(createUserschema), authenticate, createUser);
router.patch('/:id', authenticate, updateUser);
router.delete('/:id', authenticate, deleteUser);

export default router;