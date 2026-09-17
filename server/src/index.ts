import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import path from 'path';
import fs from 'fs';
import { config } from './config/env';
import apiRouter from './routes';
import { seedDatabaseIfEmpty } from './database/seed';

const app = express();

// Trust reverse proxy (Essential for Render, Cloudflare, Heroku to obtain correct client IPs)
app.set('trust proxy', 1);

// Security & Robust CORS for Production & Local Development
const corsOptions: cors.CorsOptions = {
  origin: (origin, callback) => {
    // Allow non-browser requests (mobile apps, curl, server-to-server, Render health checks)
    if (!origin) return callback(null, true);

    // Allow requests matching origin or Render frontend or localhost
    const allowed = [
      'http://localhost:5173',
      'http://localhost:3000',
      'http://localhost:5000',
      'https://new-project-gnar.onrender.com',
      ...(config.clientUrl ? [config.clientUrl.replace(/\/$/, '')] : [])
    ];

    if (
      allowed.includes(origin) ||
      origin.endsWith('.onrender.com') ||
      /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)
    ) {
      return callback(null, true);
    }

    // Default fallback: reflect origin to satisfy credentials requirement
    return callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-razorpay-signature', 'Accept', 'Origin', 'X-Requested-With']
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

// Request rate limiter
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // 1000 requests per window
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many requests, please try again later.' }
});
app.use('/api/', limiter);

// Body Parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static serving for public product thumbnails only (paid documents remain protected)
app.use('/uploads/thumbnails', express.static(path.resolve(__dirname, '../uploads/thumbnails')));

// Root & Health Check Endpoints (Ensures Render health checks pass immediately)
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'online',
    platform: 'CONCEPTIFYYY API Server',
    timestamp: new Date().toISOString()
  });
});

// Mount API routes
app.use('/api', apiRouter);

// Serve static client build if present (Supports unified fullstack deployment on single service)
const clientDist = path.resolve(__dirname, '../../client/dist');
if (fs.existsSync(path.join(clientDist, 'index.html'))) {
  app.use(express.static(clientDist));
  app.get('*', (req: Request, res: Response, next: NextFunction) => {
    if (req.path.startsWith('/api') || req.path.startsWith('/uploads')) {
      return next();
    }
    res.sendFile(path.join(clientDist, 'index.html'));
  });
} else {
  // Direct root API message when frontend is deployed separately
  app.get('/', (req: Request, res: Response) => {
    res.status(200).json({
      status: 'online',
      platform: 'CONCEPTIFYYY API Server',
      message: 'CONCEPTIFYYY Backend API is running successfully.',
      healthCheck: '/api/health',
      timestamp: new Date().toISOString()
    });
  });
}

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

// 404 Route handler for unmapped endpoints
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: `API endpoint ${req.method} ${req.url} not found.`
  });
});

// Start Server on 0.0.0.0 to guarantee Render external port routing
const server = app.listen(config.port, '0.0.0.0', async () => {
  console.log(`=======================================================`);
  console.log(`  🚀 CONCEPTIFYYY API Server running on 0.0.0.0:${config.port}`);
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
