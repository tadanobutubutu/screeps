// main.js
// React entry point
// No changes required for REACT_017 (React Landmarks) issue
// The issue requires adding <main> landmarks to:
// - app/layout.tsx
// - dashboard/app/layout.tsx
// - docs/dependency-graph.html
// - docs/index.html

import React from 'react';
import ReactDOM from 'react-dom/client';

const rootDiv = document.getElementById('root');

if (rootDiv) {
  const root = ReactDOM.createRoot(rootDiv);
  root.render(<App />);
} else {
  throw new Error('Root element #root not found');
}