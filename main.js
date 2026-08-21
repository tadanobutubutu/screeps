// Main entry point placeholder
// This file handles the main application logic

const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.send('Hello World');
});

module.exports = app;