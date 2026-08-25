import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import passport from './config/passport';
import { connectDB } from './config/database';
import { errorHandler } from './middleware/error.middleware';

dotenv.config();

const app = express();

const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // limit each IP to 1000 requests per windowMs
  message: 'Too many requests from this IP, please try again after 15 minutes'
});

// Middleware
app.use(helmet());
app.use(cors());
app.use(globalLimiter);
app.use(express.json({ limit: '10kb' })); // Body size limit
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(morgan('dev'));
app.use(passport.initialize());

// Health Check Endpoint (Liveness/Readiness Foundation)
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'UP', message: 'Sukuna API Foundation is running' });
});

// Import and mount routes (To be implemented)
// import apiRoutes from './routes';
// app.use('/api/v1', apiRoutes);

// Error Handling Middleware (must be registered last)
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

export const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

if (require.main === module) {
  startServer();
}

export default app;
