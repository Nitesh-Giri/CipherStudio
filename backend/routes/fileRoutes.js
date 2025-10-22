import express from 'express';
import { updateFile } from '../controllers/fileController.js';

const router = express.Router();

router.put('/:id', updateFile);
// Add POST for create, DELETE for delete 

export default router;