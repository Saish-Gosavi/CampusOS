import express from 'express';
import { uploadStudentDocument, getStudentDocuments } from '../controllers/documents.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { upload } from '../middleware/upload.middleware.js';

const router = express.Router();

router.use(authenticate);

router.post('/', upload.single('document'), uploadStudentDocument);
router.get('/student/:studentId', getStudentDocuments);

export default router;
