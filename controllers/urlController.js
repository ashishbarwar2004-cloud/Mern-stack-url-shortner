import mongoose from 'mongoose';
import { nanoid } from 'nanoid';
import Url from '../models/Url.js';
import { memoryStore } from '../config/dataStore.js';

export const shortenUrl = async (req, res, next) => {
  const { longUrl } = req.body;

  if (!longUrl || typeof longUrl !== 'string') {
    res.status(400);
    return next(new Error('Please provide a valid long URL'));
  }

  try {
    new URL(longUrl);
  } catch {
    res.status(400);
    return next(new Error('Invalid URL format. Must start with http:// or https://'));
  }

  try {
    const urlCode = nanoid(7);
    const baseUrl = process.env.BASE_URL || `${req.protocol}://${req.get('host')}`;
    const shortUrl = `${baseUrl}/${urlCode}`;
    const userId = req.user ? req.user.id || req.user._id : null;

    if (mongoose.connection.readyState === 1) {
      let existingUrl = await Url.findOne({ longUrl, user: userId });
      if (existingUrl) {
        return res.status(200).json({
          success: true,
          shortUrl: existingUrl.shortUrl,
          urlCode: existingUrl.urlCode,
          longUrl: existingUrl.longUrl,
          clicks: existingUrl.clicks,
        });
      }

      const newUrl = await Url.create({
        urlCode,
        longUrl,
        shortUrl,
        user: userId,
        clicks: 0,
      });

      return res.status(201).json({
        success: true,
        shortUrl: newUrl.shortUrl,
        urlCode: newUrl.urlCode,
        longUrl: newUrl.longUrl,
        clicks: newUrl.clicks,
      });
    } else {
      // Memory fallback
      const existing = memoryStore.urls.find((u) => u.longUrl === longUrl && u.user === userId);
      if (existing) {
        return res.status(200).json({
          success: true,
          shortUrl: existing.shortUrl,
          urlCode: existing.urlCode,
          longUrl: existing.longUrl,
          clicks: existing.clicks,
        });
      }

      const newUrl = {
        _id: 'mem_' + Date.now(),
        urlCode,
        longUrl,
        shortUrl,
        user: userId,
        clicks: 0,
        createdAt: new Date(),
      };
      memoryStore.urls.unshift(newUrl);

      return res.status(201).json({
        success: true,
        shortUrl: newUrl.shortUrl,
        urlCode: newUrl.urlCode,
        longUrl: newUrl.longUrl,
        clicks: newUrl.clicks,
      });
    }
  } catch (err) {
    next(err);
  }
};
