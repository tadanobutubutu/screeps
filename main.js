// main.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Existing code (preserved as-is)
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// New function to handle main content rendering
function renderMainContent(content) {
  return (
    <main>
      {content}
    </main>
  );
}

// Export all existing functions and add new ones
export { renderMainContent };