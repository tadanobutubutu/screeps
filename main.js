// main.js
// REACT_015: Added lang="en" to the root <html> tag for screen reader accessibility
// This fixes the issue where the document language was unspecified, causing
// screen readers to default to an incorrect language or require manual selection.

import React from 'react';
import ReactDOM from 'react-dom/client';

function App() {
  return (
    <html lang="en">
      <body>
        <h1>Welcome to the Application</h1>
        <p>This is a React application with proper language attribute.</p>
      </body>
    </html>
  );
}

const container = document.getElementById('root');
if (container) {
  const root = ReactDOM.createRoot(container);
  root.render(<App />);
}