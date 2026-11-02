import express from 'express';
import { getUserLinks } from '../controllers/linksController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', protect, getUserLinks);

export default router;
