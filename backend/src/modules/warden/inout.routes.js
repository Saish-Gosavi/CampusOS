import express from 'express';
import { getWardenInOutLogs, createWardenInOutLog } from './inout.controller.js';
import { authenticate } from '../../middleware/auth.middleware.js';

const router = express.Router();

router.use(authenticate);

router.get('/', getWardenInOutLogs);
router.post('/', createWardenInOutLog);

export default router;
