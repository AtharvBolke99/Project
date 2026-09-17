import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import { config } from './config/env';
import apiRouter from './routes';
import { seedDatabaseIfEmpty } from './database/seed';

const app = express();

// Security & CORS
app.use(cors({
  origin: '*',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-razorpay-signature']
}));

// Request rate limiter
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // 1000 requests per window
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many requests, please try again later.' }
});
app.use('/api/', limiter);

import path from 'path';

// Body Parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static serving for public product thumbnails only (paid documents remain protected)
app.use('/uploads/thumbnails', express.static(path.resolve(__dirname, '../uploads/thumbnails')));

// Mount API routes
app.use('/api', apiRouter);

// Global Error Handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('Unhandled Server Error:', err);
  const statusCode = err.status || 500;
  const message = config.nodeEnv === 'production'
    ? 'Internal Server Error'
    : (err.message || 'Something went wrong');

  res.status(statusCode).json({
    success: false,
    message,
    statusCode
  });
});

// 404 Route handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: `API endpoint ${req.method} ${req.url} not found.`
  });
});

// Start Server
const server = app.listen(config.port, async () => {
  console.log(`=======================================================`);
  console.log(`  🚀 CONCEPTIFYYY API Server running on port ${config.port}`);
  console.log(`  🔗 Health Check: http://localhost:${config.port}/api/health`);
  console.log(`  💳 Razorpay Mode: ${config.razorpay.isConfigured ? 'LIVE/TEST (Connected)' : 'DEVELOPMENT TEST SANDBOX'}`);
  console.log(`=======================================================`);

  // Auto-seed initial content if needed
  try {
    await seedDatabaseIfEmpty();
  } catch (seedErr) {
    console.error('Error during auto-seed check:', seedErr);
  }
});

export default app;
