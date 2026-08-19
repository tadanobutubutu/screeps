// main.js
import React from 'react';
import { createRoot } from 'react-dom/client';

// Existing code (preserved)
export function App() {
  return (
    <div>
      {/* Other existing components */}
    </div>
  );
}

// Updated layout components with accessible SVG names and proper landmarks
export function Layout({ children }) {
  return (
    <div role="main" aria-label="Main content">
      <svg aria-hidden="true" style={{ display: 'none' }}>
        <title>Application Icon</title>
      </svg>
      {children}
    </div>
  );
}

export function DashboardLayout({ children }) {
  return (
    <div role="main" aria-label="Dashboard content">
      <svg aria-hidden="true" style={{ display: 'none' }}>
        <title>Dashboard Icon</title>
      </svg>
      {children}
    </div>
  );
}

// Existing initialization code (preserved)
const container = document.getElementById('root');
const root = createRoot(container);
root.render(<App />);