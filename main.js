// main.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// Existing code (preserved)
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// New function to handle main content rendering with accessibility
export function renderMainContent(content) {
  return (
    <main className="main-content" aria-label="Main content">
      {content}
    </main>
  );
}

// Existing exports (preserved)
export const existingFunction = () => {
  // Some existing functionality
};

// New accessibility function
export function getAccessibleMainElement() {
  return document.querySelector('main') || document.body;
}

// Function to create accessible SVG wrapper
export function createAccessibleSvg(svgContent, { label = '', isDecorative = false } = {}) {
  if (isDecorative) {
    return (
      <div aria-hidden="true">
        {svgContent}
      </div>
    );
  }

  return (
    <div aria-label={label}>
      {svgContent}
    </div>
  );
}

// Preserve any other existing code
// ...