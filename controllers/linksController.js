import mongoose from 'mongoose';
import Url from '../models/Url.js';
import { memoryStore } from '../config/dataStore.js';

export const getUserLinks = async (req, res, next) => {
  try {
    const userId = req.user.id;

    if (mongoose.connection.readyState === 1) {
      const links = await Url.find({ user: userId }).sort({ createdAt: -1 });
      return res.status(200).json({
        success: true,
        count: links.length,
        links,
      });
    } else {
      const links = memoryStore.urls.filter((u) => u.user === userId);
      return res.status(200).json({
        success: true,
        count: links.length,
        links,
      });
    }
  } catch (err) {
    next(err);
  }
};
