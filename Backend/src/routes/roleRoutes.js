import express from 'express';
import {createRole, deleteRole, getRoles, updateRole} from '../controllers/roleController.js'
import { authenticate } from '../middlewares/authMiddleware.js';
import { validate } from '../middlewares/validate.middleware.js';
import { createRoleSchema, updateRoleSchema } from '../validations/role.validation.js';
const router = express.Router();

router.get('/', authenticate, getRoles);
router.post('/', validate(createRoleSchema), authenticate, createRole);
router.patch('/:id', validate(updateRoleSchema), authenticate, updateRole);
router.delete('/:id', authenticate, deleteRole);

export default router;