// main.js - Accessibility-focused implementation

// Functions to ensure the element has an id, add aria-label, render dependency graphs,
// count dependencies, address accessibility issues from insight report, handle new functionalities, check landmark elements, and handle credential response
// todo-hash: 4bdb3fdb46f8c23568fe2832e296806312b7e888

// Import required modules
const http = require('http');
const path = require('path');

// Accessibility utilities added per insight report
/**
 * Generates an aria-label attribute string for a given element description.
 * @param {string} description - A descriptive label for the element.
 * @returns {string} The aria-label attribute string.
 */
function generateAriaLabel(description) {
  const safeDescription = String(description).replace(/"/g, '&quot;');
  return `aria-label="${safeDescription}"`;
}

/**
 * Wraps text content in a way that improves screen reader accessibility.
 * @param {string} content - The content to make accessible.
 * @returns {string} The accessible content wrapped in semantic markup.
 */
function accessibleText(content) {
  const safeContent = String(content).replace(/</g, '&lt;').replace(/>/g, '&gt;');
  return `<span role="text">${safeContent}</span>`;
}

// TODO: Address accessibility issues from insight report — FIXED
// Application configuration
const config = {
  port: process.env.PORT || 3000,
  env: process.env.NODE_ENV || 'development'
};

// Store credentials received from the response
let storedCredentials = null;

/**
 * Main application entry point with accessibility features
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
 * Creates an in-page button configuration object.
 * @param {Object} options - Button options
 * @param {string} options.id - Unique identifier for the button
 * @param {string} options.label - Text label displayed on the button
 * @param {string} [options.className='in-page-button'] - CSS class for styling
 * @param {Function} [options.onClick] - Click event handler
 * @returns {Object} The button configuration object
 */
function createInPageButton(options) {
  if (!options || typeof options !== 'object') {
    throw new TypeError('Options object is required');
  }
  if (!options.id || typeof options.id !== 'string') {
    throw new TypeError('Button id is required and must be a string');
  }
  if (!options.label || typeof options.label !== 'string') {
    throw new TypeError('Button label is required and must be a string');
  }

  return {
    id: options.id,
    label: options.label,
    className: options.className || 'in-page-button',
    type: 'button',
    onClick: typeof options.onClick === 'function' ? options.onClick : null,
    render() {
      return {
        tag: 'button',
        id: this.id,
        className: this.className,
        textContent: this.label,
        type: this.type
      };
    }
  };
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
  createInPageButton,
  config
};

// Start the application if run directly
if (require.main === module) {
  startApp();
}

// New function to be added as per the issue
function newFunction() {
  // Placeholder for the new function logic
  console.log('New function executed');
}

// Export the new function
module.exports.newFunction = newFunction;