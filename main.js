// main.js
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

// Existing code (preserved)
const root = createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// New function to handle main content rendering
export function renderMainContent(content) {
  return (
    <main className="main-content">
      {content}
    </main>
  );
}

// Existing export (preserved)
export const existingFunction = () => {
  // Some existing functionality
};

// New accessibility utility function
export function getAccessibleMainElement() {
  return document.querySelector('main') || document.createElement('main');
}

// Preserve any other existing exports
export const anotherExistingExport = () => {
  // More existing functionality
};