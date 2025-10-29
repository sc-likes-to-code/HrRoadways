import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import axios from 'axios';
import smartRouteRouter from './routes/smartRoute.js';
import notificationsRouter from './routes/notifications.js'; // Added notifications route
import { globalErrorHandler } from './middleware/errorMiddleware.js';
import { AppError } from './utils/errorHandler.js';
import { setupSecurity, corsOptions } from './config/security.js';
import { sendBusDelayNotification, sendRouteCancellationNotification, sendTrafficUpdateNotification } from './utils/notificationEvents.js'; // Added notification events

// ES modules don't have __dirname, so we create it
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Security Middleware
setupSecurity(app);

// CORS and Body Parser Middleware
app.use(cors(corsOptions));
app.use(express.json({ limit: '10kb' })); // Limit body size to 10kb

// Serve static files from the React app build (if exists)
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../dist')));
}

// Routes
app.use('/api/smartRoute', smartRouteRouter);
app.use('/api/notifications', notificationsRouter); // Added notifications route

// --- Notification Simulation Endpoints ---
// Endpoint to simulate bus delay
app.post("/api/simulate/delay", async (req, res) => {
  const { route, delay, estimatedTime } = req.body;
  
  try {
    // Send notification to all subscribers
    await sendBusDelayNotification(route, delay, estimatedTime);
    
    res.json({ message: 'Delay notification sent successfully' });
  } catch (error) {
    console.error('Error sending delay notification:', error);
    res.status(500).json({ error: 'Failed to send notification' });
  }
});

// Endpoint to simulate route cancellation
app.post("/api/simulate/cancellation", async (req, res) => {
  const { route, reason } = req.body;
  
  try {
    // Send notification to all subscribers
    await sendRouteCancellationNotification(route, reason);
    
    res.json({ message: 'Cancellation notification sent successfully' });
  } catch (error) {
    console.error('Error sending cancellation notification:', error);
    res.status(500).json({ error: 'Failed to send notification' });
  }
});

// Endpoint to simulate traffic update
app.post("/api/simulate/traffic", async (req, res) => {
  const { route, update, impact } = req.body;
  
  try {
    // Send notification to all subscribers
    await sendTrafficUpdateNotification(route, update, impact);
    
    res.json({ message: 'Traffic update notification sent successfully' });
  } catch (error) {
    console.error('Error sending traffic notification:', error);
    res.status(500).json({ error: 'Failed to send notification' });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Handle undefined routes
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// Global error handling middleware
app.use(globalErrorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});