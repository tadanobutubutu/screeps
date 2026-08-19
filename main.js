import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Resolve conflict markers by keeping the merged logic and wrapping the primary
// content in a <main> element to satisfy the REACT_017 accessibility rule.
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <main>
      <App />
    </main>
  </React.StrictMode>
);