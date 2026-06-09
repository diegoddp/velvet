import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';

// Load environment variables
dotenv.config();

// Import routes
import authRoutes from './routes/auth';
import userRoutes from './routes/user';
import creatorRoutes from './routes/creator';
import contentRoutes from './routes/content';
import subscriptionRoutes from './routes/subscription';
import messageRoutes from './routes/message';
import complaintRoutes from './routes/complaint';
import paymentRoutes from './routes/payment';
import moderationRoutes from './routes/moderation';

// Initialize Express app
const app: Express = express();
const PORT = process.env.PORT || 3000;

// Initialize Prisma
export const prisma = new PrismaClient();

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3001',
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5, // stricter for auth
  message: 'Too many login attempts, please try again later.'
});

app.use(limiter);

// Body parsing
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Logging
app.use(morgan('combined'));

// Health check
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Routes
app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/creators', creatorRoutes);
app.use('/api/content', contentRoutes);
app.use('/api/subscriptions', subscriptionRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/complaints', complaintRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/moderation', moderationRoutes);

// Error handling middleware
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  
  res.status(err.status || 500).json({
    error: {
      message: err.message || 'Internal Server Error',
      status: err.status || 500,
      timestamp: new Date().toISOString()
    }
  });
});

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    error: {
      message: 'Route not found',
      status: 404
    }
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server is running on port ${PORT}`);
  console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM signal received: closing HTTP server');
  await prisma.$disconnect();
  process.exit(0);
});

export default app;
