// Main entry point for the React application
// REACT_025: Ensures only a single <main> landmark exists in the rendered tree.
// The Dashboard component has been refactored to use one <main> and <section>/<article> for other regions.

import React from 'react';
import ReactDOM from 'react-dom/client';
import Dashboard from './components/Dashboard';

const rootElement = document.getElementById('root');

if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <Dashboard />
    </React.StrictMode>
  );
}