import express from 'express';
import {getTeams, createTeam, deleteTeam, updateTeam} from '../controllers/teamController.js'
import { authenticate } from '../middlewares/authMiddleware.js';
import { validate } from '../middlewares/validate.middleware.js';
import { createTeamchema, updateTeamchema } from '../validations/team.validation.js';
const router = express.Router();

router.get('/', authenticate, getTeams);
router.post('/', validate(createTeamchema), authenticate, createTeam);
router.patch('/:id', validate(updateTeamchema), authenticate, updateTeam);
router.delete('/:id', authenticate, deleteTeam);

export default router;