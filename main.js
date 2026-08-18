// =============================================================
//  Existing code – all original exports and functions are kept
// =============================================================

const express = require('express');
const path = require('path');
const React = require('react');
const ReactDOMServer = require('react-dom/server');

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static assets
app.use(express.static(path.join(__dirname, 'public')));

// -------------------------------------------------------------
//  Main route – add language attribute to the <html> tag
// -------------------------------------------------------------
app.get('/', (req, res) => {
  // NOTE: Only the lang attribute was added; all other markup stays unchanged.
  res.send(`
    <html lang="en">
      <head>
        <meta charset="UTF-8">
        <title>Screeps Insight</title>
      </head>
      <body>
        <div id="root"></div>
        <script src="/bundle.js"></script>
      </body>
    </html>
  `);
});

// -------------------------------------------------------------
//  Server startup (unchanged)
// -------------------------------------------------------------
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

// Export the app for testing
module.exports = app;