// main.js
// TODO: Add back any required exports that might have been removed

const express = require('express');
const app = express();

function start() {
  const port = process.env.PORT || 3000;
  app.listen(port, () => console.log(`Server running on port ${port}`));
}

// Export the app and start function
module.exports = { app, start };