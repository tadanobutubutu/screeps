// main.js - Fixed with lang="en" attribute on root element
// This fix addresses accessibility issue REACT_015

// Your existing code remains unchanged
const express = require('express');
const app = express();

// Root route
app.get('/', (req, res) => {
  res.send(`
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Application</title>
</head>
<body>
  <div id="root"></div>
</body>
</html>
  `);
});

// Additional routes - PRESERVED
app.get('/api/status', (req, res) => {
  res.json({ status: 'ok', timestamp: Date.now() });
});

// Export - PRESERVED
module.exports = app;