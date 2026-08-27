// main.js - Main application entry point
import React from 'react';
import ReactDOM from 'react-dom/client';

// Mock component for testing purposes
export const App = () => {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>React App</title>
      </head>
      <body>
        <div id="root"></div>
      </body>
    </html>
  );
};

// Render function
export const renderApp = (element, container) => {
  const root = ReactDOM.createRoot(container);
  root.render(element);
};

// Initialize the app
const initialize = () => {
  const rootElement = document.getElementById('root');
  if (rootElement) {
    renderApp(<App />, rootElement);
  }
};

// Export for testing
export default { App, renderApp, initialize };