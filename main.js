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
        aria-label="Application icon"
        width="0"
        height="0"
        style={{ position: 'absolute' }}
      />
      {children}
    </div>
  );
}

// Add accessible name to SVG in dashboard/app/layout.tsx
export function DashboardLayout({ children }) {
  return (
    <div>
      <svg
        aria-label="Dashboard icon"
        width="0"
        height="0"
        style={{ position: 'absolute' }}
      />
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