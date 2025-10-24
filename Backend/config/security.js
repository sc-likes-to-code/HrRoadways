import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import xss from 'xss-clean';

// Rate limiting configuration
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again after 15 minutes',
  standardHeaders: true,
  legacyHeaders: false,
});

// CORS Configuration
const corsOptions = {
  origin: [
    'http://localhost:3000',
    'http://localhost:5173', // Vite default port
    'https://hrroadways.vercel.app',
    // Add your production domains here
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  maxAge: 86400, // 24 hours
};

// Input sanitization function
const sanitizeInput = (input) => {
  if (typeof input === 'string') {
    // Remove HTML tags and special characters
    return input.replace(/<[^>]*>?/gm, '').replace(/[^\w\s-]/g, '');
  }
  return input;
};

// Middleware to sanitize request body
const sanitizeRequest = (req, res, next) => {
  if (req.body) {
    Object.keys(req.body).forEach(key => {
      req.body[key] = sanitizeInput(req.body[key]);
    });
  }
  if (req.query) {
    Object.keys(req.query).forEach(key => {
      req.query[key] = sanitizeInput(req.query[key]);
    });
  }
  next();
};

// Security middleware setup
const setupSecurity = (app) => {
  // Helmet middleware for security headers
  app.use(helmet());

  // Set specific CSP rules
  app.use(
    helmet.contentSecurityPolicy({
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
        styleSrc: ["'self'", "'unsafe-inline'", 'https:'],
        imgSrc: ["'self'", 'data:', 'https:'],
        connectSrc: ["'self'", 'https://api.mapbox.com'],
        fontSrc: ["'self'", 'https:', 'data:'],
        objectSrc: ["'none'"],
        mediaSrc: ["'self'"],
        frameSrc: ["'self'"],
      },
    })
  );

  // Rate limiting
  app.use('/api', limiter);

  // XSS Prevention
  app.use(xss());

  // Custom input sanitization
  app.use(sanitizeRequest);
};

export { setupSecurity, corsOptions, sanitizeInput };