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

// Add accessible name to SVG in app/layout.tsx
export function Layout({ children }) {
  return (
    <div>
      <svg
        aria-hidden="true"
        width="0"
        height="0"
        style={{ position: 'absolute' }}
      >
        <title>Application icon</title>
      </svg>
      {children}
    </div>
  );
}

// Add accessible name to SVG in dashboard/app/layout.tsx
export function DashboardLayout({ children }) {
  return (
    <div>
      <svg
        aria-hidden="true"
        width="0"
        height="0"
        style={{ position: 'absolute' }}
      >
        <title>Dashboard icon</title>
      </svg>
      {children}
    </div>
  );
}

// Existing code (preserved)
export function renderApp() {
  const container = ...
  const root = createRoot(container);
  root.render(<App />);
}

// Any other existing exports remain unchanged