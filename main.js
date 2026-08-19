import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

// Existing code preserved
function renderApp() {
  const container = document.getElementById('root');
  if (container) {
    const root = createRoot(container);
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
  }
}

renderApp();

// If module.hot exists, enable hot reloading
if (module.hot) {
  module.hot.accept('./App', () => {
    renderApp();
  });
}

// Add this new function to handle SVG accessibility
function makeSvgAccessible(svgElement, label) {
  if (!svgElement) return;

  // If the SVG is decorative, mark it as hidden
  if (!label) {
    svgElement.setAttribute('aria-hidden', 'true');
    return;
  }

  // Otherwise, add an accessible name
  svgElement.setAttribute('aria-label', label);
}

// Export all existing functions
export { renderApp, makeSvgAccessible };