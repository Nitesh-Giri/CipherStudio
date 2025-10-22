import express from 'express';
import { createProject, getProject } from '../controllers/projectController.js';

const router = express.Router();

router.post('/', createProject);
router.get('/:id', getProject);

export default router;