// main.js - Updated version with fixes for REACT_025 and conflict resolution
const express = require('express');
const path = require('path');
const fs = require('fs');
const cookieParser = require('cookie-parser');
const compression = require('compression');
const helmet = require('helmet');

const app = express();
const PORT = process.env.PORT || 3000;

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}));

app.use(compression());
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Set up routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/dashboard', (req, res) => {
  // In the actual Dashboard.tsx, we'll fix this
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// API endpoints
app.get('/api/stats', (req, res) => {
  // Return some stats
  res.json({
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    memory: process.memoryUsage()
  });
});

app.get('/api/error-test', (req, res) => {
  // Simulate an error for testing error handling
  res.status(500).json({
    message: 'Simulated error for testing',
    details: 'Error details here'
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Client-side DOM manipulation logic
// Note: This block assumes the code is running in a browser context 
// or is part of a bundled client-side script.
if (typeof document !== 'undefined') {
  document.addEventListener("DOMContentLoaded", function() {
    // Adding the lang attribute to the html tag
    const htmlElement = document.querySelector('html');
    if (htmlElement) {
      htmlElement.setAttribute('lang', 'en');
    }
  });
}

module.exports = app;