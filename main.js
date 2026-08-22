// Application entry point
const express = require('express');
const path = require('path');
const fs = require('fs');

// Configuration
const PORT = process.env.PORT || 3000;
const ENV = process.env.NODE_ENV || 'development';

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

// New function for accessibility check
function accessibilityCheck(req, res, next) {
  // Dummy implementation of an accessibility check
  console.log('Accessibility check triggered');
  // Add actual accessibility check logic here if needed
  next();
}

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
  
  // Add accessibility check middleware
  app.use(accessibilityCheck);
  
  return app;
}

// Graceful shutdown
function shutdown() {
  db.disconnect();
  console.log('Server shutting down gracefully');
}

// Start server if run directly
if (require.main === module) {
  initialize().listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
  });
}

// Export all required modules
module.exports = {
  app,
  initialize,
  shutdown,
  homeRoute,
  statusRoute,
  errorHandler,
  accessibilityCheck,
  PORT,
  ENV
};