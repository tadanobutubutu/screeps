// main.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Existing code (preserved)
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// New function to wrap content in main landmark
function wrapWithMain(content) {
  return <main>{content}</main>;
}

// Export all existing functions (preserved)
export { wrapWithMain };

// Example usage (you can remove this if not needed)
const MainContent = () => (
  <div>
    <h1>Welcome to the App</h1>
    <p>This is the main content area.</p>
  </div>
);

// Render wrapped content
root.render(
  <React.StrictMode>
    {wrapWithMain(<MainContent />)}
  </React.StrictMode>
);