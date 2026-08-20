// Main.js - Application entry point
// This file handles the main application logic

const express = require('express');
const next = require('next');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();

  server.get('*', (req, res) => {
    return handle(req, res);
  });

  server.listen(3000, (err) => {
    if (err) throw err;
    console.log('> Ready on http://localhost:3000');
  });
});

// Note: The actual fix for REACT_017 (React Landmarks) requires 
// adding <main> elements to the layout files mentioned in the issue:
// - app/layout.tsx
// - dashboard/app/layout.tsx
// - docs/index.html
// - and 1 other file

// The <main> landmark should wrap the primary content of each page.
// Example fix for app/layout.tsx:
// <body>
//   <main>  {/* Add this */}
//     {children}
//   </main> {/* Add this */}
// </body>

module.exports = { app, handle };