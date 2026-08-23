import React from 'react';
import ReactDOM from 'react-dom/client';

// Main entry point - ensures a single <main> landmark in the entire document
const root = ReactDOM.createRoot(document.getElementById('root'));

// Render the Dashboard component as the primary application
root.render(
  <React.StrictMode>
    <Dashboard />
  </React.StrictMode>
);

export default Dashboard;