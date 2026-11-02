import express from 'express';
import { shortenUrl } from '../controllers/urlController.js';
import { optionalAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', optionalAuth, shortenUrl);

export default router;
