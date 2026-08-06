import express from 'express';
import { getNotices, createNotice } from '../controllers/notices.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = express.Router();

router.use(authenticate);

router.get('/', getNotices);
router.post('/', createNotice);

export default router;
