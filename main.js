import React from 'react';
import { createRoot } from 'react-dom/client';

function App() {
  return (
    <div>
      {/* Favicon SVG with aria-hidden */}
      <svg
        aria-hidden="true"
        style={{ display: 'none' }}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 100 100"
      >
        <title>Favicon</title>
        <circle cx="50" cy="50" r="40" fill="#61dafb" />
      </svg>

      {/* Main content */}
      <h1>Welcome to the App</h1>
      <p>This is a React application.</p>
    </div>
  );
}

const container = document.getElementById('root');
const root = createRoot(container);
root.render(<App />);

// Export all existing functions if any
export { /* existing exports */ };