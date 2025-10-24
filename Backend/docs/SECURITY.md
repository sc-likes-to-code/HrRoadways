# Security Implementation Documentation

## Overview
This document outlines the security measures implemented in the HrRoadways backend application.

## Features

### 1. Helmet.js Security Headers
- Implements various HTTP headers to prevent common web vulnerabilities
- Content Security Policy (CSP) configuration
- XSS Protection
- Prevent clickjacking
- Disable MIME type sniffing
- DNS Prefetch Control

### 2. Rate Limiting
- Limits: 100 requests per 15 minutes per IP
- Applies to all API routes
- Custom error message for rate limit exceeded
- Standardized rate limit headers

### 3. CORS Configuration
Allowed Origins:
- http://localhost:3000 (Development)
- http://localhost:5173 (Vite Development)
- https://hrroadways.vercel.app (Production)

Methods allowed:
- GET
- POST
- PUT
- DELETE
- OPTIONS

### 4. Input Sanitization
- Removes HTML tags
- Removes special characters
- Sanitizes both request body and query parameters
- Custom sanitization for specific input types

## Usage

### Adding New Origins
To add new allowed origins, update the corsOptions in `config/security.js`:
```javascript
const corsOptions = {
  origin: [
    'http://localhost:3000',
    'your-new-domain.com'
  ],
  // ...
};
```

### Modifying Rate Limits
To adjust rate limiting, modify the limiter configuration in `config/security.js`:
```javascript
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // Adjust time window
  max: 100, // Adjust max requests
  // ...
});
```

### Custom CSP Rules
To modify Content Security Policy rules, update the helmet configuration:
```javascript
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      // Add or modify directives
    },
  })
);
```

## Security Best Practices
1. Keep dependencies updated
2. Use HTTPS in production
3. Implement proper authentication
4. Regular security audits
5. Monitor rate limiting effectiveness
6. Keep CORS origins list minimal
7. Regular review of CSP rules

## Testing
To test the security implementations:

1. Rate Limiting:
```bash
# Send multiple requests quickly
for i in {1..110}; do curl http://localhost:5000/api/smartRoute; done
```

2. CORS:
```bash
curl -H "Origin: http://unauthorized-domain.com" \
  -H "Access-Control-Request-Method: GET" \
  -X OPTIONS http://localhost:5000/api/smartRoute
```

3. XSS Protection:
```bash
curl -X POST http://localhost:5000/api/smartRoute \
  -H "Content-Type: application/json" \
  -d '{"source": "<script>alert(1)</script>"}'
```

## Monitoring
- Monitor rate limiting effectiveness
- Review security headers regularly
- Check for blocked requests in logs
- Monitor for suspicious patterns