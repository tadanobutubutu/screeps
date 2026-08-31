/**
 * Main application entry point
 */

// Import required modules
const http = require('http');
const path = require('path');

// TODO: This is the existing code that needs to be preserved

// Application configuration
const config = {
  port: process.env.PORT || 3000,
  env: process.env.NODE_ENV || 'development'
};

/**
 * Creates and starts the HTTP server
 * @returns {http.Server} The created server instance
 */
function createServer() {
  const server = http.createServer((req, res) => {
    // Request logging
    const startTime = Date.now();
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    
    // CORS headers for cross-origin requests
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    
    // Handle preflight requests
    if (req.method === 'OPTIONS') {
      res.writeHead(204);
      res.end();
      return;
    }
    
    // Parse URL and extract pathname
    const url = new URL(req.url, `http://${req.headers.host}`);
    const pathname = url.pathname;
    
    // Route handling
    try {
      // Health check endpoint
      if (pathname === '/health' || pathname === '/') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ 
          status: 'ok', 
          config,
          timestamp: new Date().toISOString()
        }));
      }
      // Status endpoint
      else if (pathname === '/status') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ 
          status: 'healthy',
          uptime: process.uptime(),
          memory: process.memoryUsage(),
          config 
        }));
      }
      // 404 for unknown routes
      else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ 
          error: 'Not Found',
          path: pathname,
          method: req.method
        }));
      }
      
      // Log request completion
      const duration = Date.now() - startTime;
      console.log(`[${new Date().toISOString()}] Completed in ${duration}ms`);
      
    } catch (error) {
      // Error handling
      console.error(`[ERROR] Request failed:`, error.message);
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ 
        error: 'Internal Server Error',
        message: error.message 
      }));
    }
  });
  
  // Server error handling
  server.on('error', (error) => {
    if (error.code === 'EADDRINUSE') {
      console.error(`Port ${config.port} is already in use`);
    } else {
      console.error('Server error:', error);
    }
  });
  
  // Server timeout configuration
  server.timeout = 30000;
  server.keepAliveTimeout = 5000;
  server.headersTimeout = 6000;
  
  return server;
}

/**
 * Starts the application
 */
function startApp() {
  const server = createServer();
  server.listen(config.port, () => {
    console.log(`Server running on port ${config.port}`);
    console.log(`Environment: ${config.env}`);
    console.log(`PID: ${process.pid}`);
  });
  return server;
}

// Export functions for testing
module.exports = {
  createServer,
  startApp,
  config
};

// Start the application if run directly
if (require.main === module) {
  startApp();
}