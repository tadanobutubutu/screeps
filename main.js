const React = require('react');
const ReactDOM = require('react-dom/client');
const express = require('express');
const path = require('path');
const fs = require('fs');
const http = require('http');
const next = require('next');

// Configuration
const PORT = process.env.PORT || 3000;
const ENV = process.env.NODE_ENV || 'development';
const SERVER_TYPE = process.env.SERVER_TYPE || 'express'; // 'express' or 'next'

// Initialize Express app
const app = express();

// Middleware setup
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database connection (placeholder)
const db = {
  connect: () => console.log('Database connected'),
  disconnect: () => console.log('Database disconnected')
};

// TODO: Add back any required exports that might have been?

// Route handlers
const homeRoute = (req, res) => {
  res.json({ message: 'Welcome to the API', status: 'ok' });
};

const statusRoute = (req, res) => {
  res.json({
    environment: ENV,
    timestamp: new Date().toISOString()
  });
};

// Error handling middleware
const errorHandler = (err, req, res, next) => {
  console.error('Error:', err.message);
  res.status(500).json({ error: 'Internal server error' });
};

// Application initialization
function initialize() {
  db.connect();
  console.log(`Server starting in ${ENV} mode`);

  app.get('/', homeRoute);
  app.get('/status', statusRoute);
  app.use(errorHandler);

  return app;
}

// Graceful shutdown
function shutdown() {
  db.disconnect();
  console.log('Server shutting down gracefully');
}

// Dynamic import for Next.js App Router
async function nextBootstrap() {
  try {
    // Import the app directory dynamically to support App Router
    const { createServer } = require('http');
    const next = require('next');

    const dev = process.env.NODE_ENV !== 'production';
    const hostname = 'localhost';
    const port = parseInt(process.env.PORT || '3000', 10);

    const app = next({ dev, hostname, port });
    const handle = app.getRequestHandler();

    await app.prepare();

    createServer(async (req, res) => {
      try {
        await handle(req, res);
      } catch (err) {
        console.error('Error occurred handling', req.url, err);
        res.statusCode = 500;
        res.end('internal server error');
      }
    }).listen(port, () => {
      console.log(`> Ready on http://${hostname}:${port}`);
    });
  } catch (err) {
    console.error('Failed to start application:', err);
    process.exit(1);
  }
}

// Start server if run directly
function startServer() {
  if (SERVER_TYPE === 'next') {
    nextBootstrap();
  } else {
    const expressApp = initialize();
    expressApp.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
    });
  }
}

if (require.main === module) {
  startServer();
}

// Export all required modules
module.exports = {
  app,
  initialize,
  shutdown,
  homeRoute,
  statusRoute,
  errorHandler,
  PORT,
  ENV,
  bootstrap: nextBootstrap,
  nextBootstrap,
  startServer
};