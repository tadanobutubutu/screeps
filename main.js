// main.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// For app/layout.tsx
const AppLayout = ({ children }) => {
  return (
    <React.StrictMode>
      <main lang="en" role="main">
        {children}
      </main>
    </React.StrictMode>
  );
};

// For dashboard/app/layout.tsx
const DashboardLayout = ({ children }) => {
  return (
    <React.StrictMode>
      <main lang="en" role="main">
        {children}
      </main>
    </React.StrictMode>
  );
};

// Main rendering
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Add a new component for the unrotate button
const UnrotateButton = ({ onClick }) => {
  return (
    <button id="unrotate" onClick={onClick}>
      rotate back
    </button>
  );
};

// Export all existing functions if any
// (Preserve any existing exports from the original file)
export { AppLayout, DashboardLayout, UnrotateButton };