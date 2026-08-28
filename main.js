// main.js - Application entry point

const express = require('express');
const app = express();

// TODO: This is the existing code that needs to be preserved
// (This comment remains as-is)

const PORT = process.env.PORT || 3000;

// Existing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Existing routes
app.get('/', (req, res) => {
  res.send('Welcome to the application');
});

app.get('/health', (req, res) => {
  res.json({ status: 'healthy' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;