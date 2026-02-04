import express from 'express';
import {createUser, deleteUser, getAUser, getUsers, updateUser} from '../controllers/userController.js'

const router = express.Router();

router.get('/', getUsers);
router.get('/:id', getAUser);
router.post('/', createUser);
router.patch('/:id', updateUser);
router.delete('/:id', deleteUser);

export default router;