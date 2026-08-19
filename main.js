// Existing code from main.js
// ... (Preserve all existing code, exports, and functions)

// To add the line to the root element of your HTML document, we can export an HTML template in JSX.
// This allows us to maintain consistency by keeping the change in the main JavaScript file.
// app/layout.jsx
import React from 'react';

export default function RootLayout() {
  return (
    <html lang="en">
      {/* Add the line here */}
      <head>
        {/* Your existing head content goes here */}
      </head>
      <body>
        <main>
          {/* Your existing content goes here */}
        </main>
      </body>
    </html>
  );
}

// Modify the `createApp` function to use the newly created `RootLayout` component.
// game/app.ts
import express from 'express';
import app from './shared/app';
import RootLayout from './layouts/RootLayout';

app.set('views', './views');
app.set('view engine', 'jade');
app.engine('jade', require('jade'));

app.get('/', (req, res) => {
  res.render('index', { layout: false });
});

// Add the route for the dependency graph.
app.get('/dependency-graph', (req, res) => {
  res.render('dependency-graph', { layout: RootLayout });
});

// Start the server
const server = app.listen(process.env.PORT || 3000, () => {
  console.log(`Server running at http://localhost:${server.address().port}`);
});