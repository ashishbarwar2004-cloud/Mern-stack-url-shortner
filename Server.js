import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';

import urlRoutes from './routes/urls.js';
import authRoutes from './routes/auth.js';
import linkRoutes from './routes/links.js';
import indexRoutes from './routes/index.js';
import errorHandler from './middleware/errorMiddleware.js';

dotenv.config();

// Attempt database connection
connectDB();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Health Check
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', service: 'Short.ly API' });
});

// Mount API routes FIRST
app.use('/api/shorten', urlRoutes);
app.use('/api/url', urlRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/links', linkRoutes);

// Catch-all redirect route (MUST be last after API routes)
app.use('/', indexRoutes);

// Error handling middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));