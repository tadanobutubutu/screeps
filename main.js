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

// Updated layout components with accessible SVG names
export function Layout({ children }) {
  return (
    <div>
      <svg aria-hidden="true" style={{ display: 'none' }}>
        <title>Application Icon</title>
      </svg>
      {children}
    </div>
  );
}

export function DashboardLayout({ children }) {
  return (
    <div>
      <svg aria-hidden="true" style={{ display: 'none' }}>
        <title>Dashboard Icon</title>
      </svg>
      {children}
    </div>
  );
}

// New component for the rotate back button
export function RotateBackButton({ onClick }) {
  return (
    <button
      id="unrotate"
      onClick={onClick}
      style={{
        background: 'none',
        border: 'none',
        padding: 0,
        font: 'inherit',
        color: 'inherit',
        cursor: 'pointer'
      }}
    >
      rotate back
    </button>
  );
}

// Existing initialization code (preserved)
const container = document.getElementById('root');
const root = createRoot(container);
root.render(<App />);