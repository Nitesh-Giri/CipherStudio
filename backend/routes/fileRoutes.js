import express from 'express';
import { updateFile } from '../controllers/fileController.js';

const router = express.Router();

router.put('/:id', updateFile);
import { createFile, deleteFile } from '../controllers/fileController.js';
import { renameFile } from '../controllers/fileController.js';

router.post('/', createFile);
router.delete('/:id', deleteFile);
router.patch('/:id/rename', renameFile);

export default router;