import express from 'express';
import { getInOutLogs, createInOutLog } from '../controllers/inout.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = express.Router();

router.use(authenticate);

router.get('/', getInOutLogs);
router.post('/', createInOutLog);

export default router;
