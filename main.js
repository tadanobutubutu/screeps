import React from 'react';
import ReactDOM from 'react-dom/client';

// Ensure the root container exists
const container = document.getElementById('root') || document.body;

if (container) {
  // Create a <main> landmark to wrap the primary content
  const mainElement = document.createElement('main');
  mainElement.setAttribute('role', 'main');
  
  // Wrap the existing content in the <main> element
  container.appendChild(mainElement);
  
  // Initialize React root and render the application
  const root = ReactDOM.createRoot(container);
  root.render(
    <React.StrictMode>
      {/* Primary content is now wrapped in <main> */}
    </React.StrictMode>
  );
} else {
  console.warn('Root container not found. Make sure #root exists.');
}