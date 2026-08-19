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

// Example usage (can be removed or modified as needed)
const MainContent = () => (
  <div>
    <h1>Welcome to the Application</h1>
    <p>This is the primary content area.</p>
  </div>
);

// Wrap the main content with the landmark
const WrappedMainContent = wrapWithMain(<MainContent />);

// Render the wrapped content
root.render(
  <React.StrictMode>
    <WrappedMainContent />
  </React.StrictMode>
);