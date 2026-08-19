import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// New function to handle main content rendering with accessibility attributes
export function renderMainContent(content) {
  return (
    <main className="main-content" role="main" aria-label="Main content">
      {content}
    </main>
  );
}

// Existing exports (preserved)
export const existingFunction = () => {
  // Some existing functionality
};

// New accessibility function with improved implementation
export function getAccessibleMainElement() {
  const mainElement = document.querySelector('main');
  if (mainElement) {
    return mainElement;
  }

  // Fallback to body with warning
  console.warn('No main element found, falling back to body for accessibility');
  const bodyElement = document.body;
  bodyElement.setAttribute('role', 'main');
  bodyElement.setAttribute('aria-label', 'Main content');
  return bodyElement;
}

/**
 * Adds accessible name to SVG elements to comply with REACT_041 rule
 * @param {React.ReactElement} svgElement - The SVG element to make accessible
 * @param {string} label - The accessible name for the SVG
 * @returns {React.ReactElement} The accessible SVG element
 */
export function makeSvgAccessible(svgElement, label) {
  return React.cloneElement(svgElement, {
    'aria-label': label,
    role: 'img'
  });
}

// Layout components
const AppLayout = ({ children }) => {
  return (
    <React.StrictMode>
      <main>
        {children}
      </main>
    </React.StrictMode>
  );
};

const DashboardLayout = ({ children }) => {
  return (
    <React.StrictMode>
      <main>
        {children}
      </main>
    </React.StrictMode>
  );
};

// Export all components for testing
export {
  AppLayout,
  DashboardLayout,
  DependencyGraph,
  DocsIndex
};