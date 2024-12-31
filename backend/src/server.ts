import dotenv from 'dotenv';
dotenv.config(); // This must be first

import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { connectDB } from './config/database';
import { validateEnv } from './config/validateEnv';
import bookRoutes from './routes/bookRoutes';
import orderRoutes from './routes/orderRoutes';
import paymentRoutes from './routes/paymentRoutes';
import testRoutes from './routes/testRoutes';
import adminRoutes from './routes/adminRoutes';

// Check environment variables
console.log('Environment check:', {
  hasApiKey: !!process.env.COINBASE_API_KEY,
  hasMongoUri: !!process.env.MONGODB_URI,
  port: process.env.PORT
});

const env = validateEnv();

// Connect to database
connectDB().then(() => {
  console.log('Connected to MongoDB');
}).catch(err => {
  console.error('MongoDB connection error:', err);
  process.exit(1);
});

const app = express();

app.use(cors());
app.use(express.json());

// Health check route
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});
app.use('/api/admin', adminRoutes);
app.use('/api', testRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payments', paymentRoutes);

// Error handling
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Server error', message: err.message });
});

const port = env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
  console.log(`Health check: http://localhost:${port}/health`);
});