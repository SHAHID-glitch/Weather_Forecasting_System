const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');
require('dotenv').config();

const weatherRoutes = require('./routes/weatherRoutes');
const forecastRoutes = require('./routes/forecastRoutes');
const { errorHandler } = require('./middleware/errorHandler');
const logger = require('./utils/logger');

const app = express();
const PORT = process.env.PORT || 3000;
const API_VERSION = process.env.API_VERSION || 'v1';

// Security middleware with CSP configuration for frontend
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      scriptSrc: ["'self'"],
      connectSrc: ["'self'", "http://localhost:3000"],
    },
  },
}));
app.use(cors());

// Serve static files from public directory
app.use(express.static(path.join(__dirname, 'public')));

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(`/api/${API_VERSION}`, limiter);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// API Routes
app.use(`/api/${API_VERSION}/weather`, weatherRoutes);
app.use(`/api/${API_VERSION}/forecast`, forecastRoutes);

// API info route
app.get('/api', (req, res) => {
  res.json({
    message: 'Welcome to Weather Forecasting API',
    version: API_VERSION,
    endpoints: {
      health: '/health',
      currentWeather: `/api/${API_VERSION}/weather/current`,
      forecastByCity: `/api/${API_VERSION}/forecast/city`,
      forecastByCoords: `/api/${API_VERSION}/forecast/coordinates`,
    },
    documentation: 'See README.md for detailed API documentation',
    frontend: 'Visit / for the web interface',
  });
});

// 404 handler for API routes only
app.use('/api', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found',
  });
});

// Error handling middleware
app.use(errorHandler);

// Start server only when running locally.
// In Vercel serverless, this file is imported and the runtime handles requests.
if (require.main === module) {
  app.listen(PORT, () => {
    logger.info(`Weather Forecasting API server running on port ${PORT}`);
    logger.info(`Environment: ${process.env.NODE_ENV || 'development'}`);
    logger.info(`API Version: ${API_VERSION}`);
  });
}

module.exports = app;
