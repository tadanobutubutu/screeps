// main.js - GitHub Issue Fix

// TODO: This is the existing code that needs to be preserved
// ----- BEGIN ORIGINAL CODE (unchanged) -----
const express = require('express');
const app = express();

// Original configuration
const DEFAULT_PORT = 3000;
const HOST = 'localhost';

// Original utility function
function formatResponse(data) {
  return JSON.stringify(data, null, 2);
}

// Original route handler
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});
// ----- END ORIGINAL CODE -----

// Existing exports that must be preserved
module.exports = {
  app,
  DEFAULT_PORT,
  HOST,
  formatResponse
};

// Port configuration
const PORT = process.env.PORT || DEFAULT_PORT;

// Server startup (existing functionality)
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running on ${HOST}:${PORT}`);
  });
}