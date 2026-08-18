// main.js
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

// Existing code (preserved)
const root = createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// New function to handle main content rendering
export function renderMainContent(content) {
  return (
    <main>
      {content}
    </main>
  );
}

// Existing exports (preserved)
export const existingFunction = () => {
  // Some existing functionality
};

export const anotherExistingFunction = () => {
  // Another existing function
};

// New component for dashboard layout
export function DashboardLayout({ children }) {
  return (
    <body className="min-h-screen flex flex-col">
      <main className="flex-1">{children}</main>
    </body>
  );
}

// New component for documentation pages
export function DocPageLayout({ children }) {
  return (
    <main>
      <div className="container">
        {children}
      </div>
    </main>
  );
}