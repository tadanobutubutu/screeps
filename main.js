// Accessibility: Screeps Game UI - Main Entry Point

import React from 'react';
import { createRoot } from 'react-dom/client';
import Dashboard from './Dashboard';

// Initialize accessibility: add lang attribute to document
document.documentElement.lang = 'en';

// Main application component with proper semantic HTML
function App() {
  return (
    <main id="main-content" role="main">
      <Dashboard />
    </main>
  );
}

// Mount the application
const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(<App />);
}

export default App;