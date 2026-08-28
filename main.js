// main.js - Application entry point

const express = require('express');
const app = express();

const { hello, getVersion, getConfig, createInPageButton, addressAccessibilityIssues, generateAccessibilityReport, calculateAccessibilityScore } = require('./');

const PORT = process.env.PORT || 3000;

// Existing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Imported functions
app.get('/', (req, res) => {
  res.send(hello());
});

app.get('/version', (req, res) => {
  res.send(getVersion());
});

app.get('/config', (req, res) => {
  res.json(getConfig());
});

// Existing routes
app.get('/health', (req, res) => {
  res.json({ status: 'healthy' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;