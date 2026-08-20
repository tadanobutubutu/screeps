import React from 'react';
import ReactDOM from 'react-dom/client';

// Ensure the root element has a main landmark for accessibility
const rootElement = document.getElementById('root');

if (!rootElement) {
  console.error('Root element #root not found');
  // Fallback: create a main element if not present
  const main = document.createElement('main');
  rootElement.appendChild(main);
}

const root = ReactDOM.createRoot(rootElement);
root.render(<App />);