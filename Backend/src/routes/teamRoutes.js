import express from 'express';
import {getTeams, createTeam, deleteTeam, updateTeam} from '../controllers/teamController.js'
import { authenticate } from '../middlewares/authMiddleware.js';
const router = express.Router();

router.get('/', authenticate, getTeams);
router.post('/', authenticate, createTeam);
router.patch('/:id', authenticate, updateTeam);
router.delete('/:id', authenticate, deleteTeam);

export default router;