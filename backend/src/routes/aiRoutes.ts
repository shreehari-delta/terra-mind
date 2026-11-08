import { Router } from 'express';
import multer from 'multer';
import { analyzeImage } from '../controllers/aiController';
import { protect } from '../middleware/auth';

const router = Router();

// Store file in RAM temporarily before forwarding
const upload = multer({ storage: multer.memoryStorage() });

// The route is protected by JWT, requiring users to be logged in
router.post('/analyze', protect, upload.single('file'), analyzeImage);

export default router;