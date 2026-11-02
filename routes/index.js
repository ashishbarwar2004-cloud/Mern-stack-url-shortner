import express from 'express';
import mongoose from 'mongoose';
import Url from '../models/Url.js';
import { memoryStore } from '../config/dataStore.js';

const router = express.Router();

router.get('/:code', async (req, res, next) => {
  const { code } = req.params;

  // Skip favicon or API routes
  if (code === 'favicon.ico' || code === 'api') {
    return next();
  }

  try {
    if (mongoose.connection.readyState === 1) {
      const url = await Url.findOne({ urlCode: code });
      if (url) {
        url.clicks += 1;
        await url.save();
        return res.redirect(url.longUrl);
      }
      return res.status(404).json({ success: false, error: 'Short URL not found' });
    } else {
      const url = memoryStore.urls.find((u) => u.urlCode === code);
      if (url) {
        url.clicks += 1;
        return res.redirect(url.longUrl);
      }
      return res.status(404).json({ success: false, error: 'Short URL not found' });
    }
  } catch (err) {
    next(err);
  }
});

export default router;
