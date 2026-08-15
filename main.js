// main.js - Application Entry Point

// Import required modules
const http = require('http');
const { v4: uuidv4 } = require('uuid');

// Configuration
const config = {
  port: process.env.PORT || 3000,
  host: process.env.HOST || 'localhost',
  environment: process.env.NODE_ENV || 'development',
};

// posthog-js update - Analytics initialization
const initializeAnalytics = (apiKey) => {
  if (!apiKey) {
    console.warn('Analytics API key not provided');
    return null;
  }
  
  const posthog = {
    init: (key) => {
      console.log(`Initializing PostHog with key: ${key.substring(0, 8)}...`);
      return { sessionId: uuidv4() };
    },
    capture: (event, properties) => {
      console.log(`Capturing event: ${event}`, properties);
    },
  };
  
  return posthog.init(apiKey);
};

// typescript update - Type validation utilities
const validateTypes = (data, schema) => {
  if (typeof data !== 'object' || data === null) {
    return { valid: false, error: 'Data must be an object' };
  }
  
  if (!schema || typeof schema !== 'object') {
    return { valid: false, error: 'Invalid schema provided' };
  }
  
  const errors = [];
  
  for (const [key, expectedType] of Object.entries(schema)) {
    if (!(key in data)) {
      errors.push(`Missing required field: ${key}`);
      continue;
    }
    
    if (typeof data[key] !== expectedType) {
      errors.push(`Field ${key} expected ${expectedType}, got ${typeof data[key]}`);
    }
  }
  
  return {
    valid: errors.length === 0,
    errors,
  };
};

// undici update - HTTP client utilities
const createHttpClient = (baseUrl, options = {}) => {
  const client = {
    baseUrl,
    timeout: options.timeout || 5000,
    headers: {
      'Content-Type': 'application/json',
      'User-Agent': 'AI-App/1.0',
      ...options.headers,
    },
  };
  
  const request = async (path, method = 'GET', body = null) => {
    const url = `${client.baseUrl}${path}`;
    
    return new Promise((resolve, reject) => {
      const timeoutId = setTimeout(() => {
        reject(new Error(`Request timeout: ${url}`));
      }, client.timeout);
      
      const req = http.request(
        url,
        {
          method,
          headers: client.headers,
        },
        (res) => {
          clearTimeout(timeoutId);
          let data = '';
          
          res.on('data', (chunk) => {
            data += chunk;
          });
          
          res.on('end', () => {
            try {
              resolve({
                status: res.statusCode,
                data: JSON.parse(data),
                headers: res.headers,
              });
            } catch (e) {
              resolve({
                status: res.statusCode,
                data,
                headers: res.headers,
              });
            }
          });
        }
      );
      
      req.on('error', (err) => {
        clearTimeout(timeoutId);
        reject(err);
      });
      
      if (body) {
        req.write(JSON.stringify(body));
      }
      
      req.end();
    });
  };
  
  return {
    get: (path) => request(path, 'GET'),
    post: (path, body) => request(path, 'POST', body),
    put: (path, body) => request(path, 'PUT', body),
    delete: (path) => request(path, 'DELETE'),
  };
};

// Main application logic
const handleRequest = (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  
  switch (url.pathname) {
    case '/health':
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ status: 'healthy', timestamp: Date.now() }));
      break;
      
    case '/api/validate':
      if (req.method === 'POST') {
        let body = '';
        req.on('data', (chunk) => {
          body += chunk.toString();
        });
        req.on('end', () => {
          try {
            const data = JSON.parse(body);
            const result = validateTypes(data, { id: 'string', name: 'string' });
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(result));
          } catch (e) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Invalid JSON' }));
          }
        });
      } else {
        res.writeHead(405, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Method not allowed' }));
      }
      break;
      
    default:
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Not found' }));
      break;
  }
};

// Server initialization
const startServer = () => {
  const server = http.createServer(handleRequest);
  
  server.listen(config.port, config.host, () => {
    console.log(`Server running at http://${config.host}:${config.port}`);
    console.log(`Environment: ${config.environment}`);
  });
  
  return server;
};

// Graceful shutdown
const shutdown = (signal) => {
  console.log(`Received ${signal}. Shutting down gracefully...`);
  process.exit(0);
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

// Export functions for testing
module.exports = {
  config,
  initializeAnalytics,
  validateTypes,
  createHttpClient,
  handleRequest,
  startServer,
  shutdown,
};

// Start server if run directly
if (require.main === module) {
  startServer();
}