import express from 'express';
import { saveSnapshot, listSnapshots, restoreSnapshot } from '../controllers/snapshotController.js';

const router = express.Router();

router.post('/', saveSnapshot);
router.get('/:projectId', listSnapshots);
router.post('/:id/restore', restoreSnapshot);

export default router;
