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

// New function to handle main content wrapping
export function wrapWithMain(content) {
  return <main>{content}</main>;
}

// Updated layout components with main landmarks
export function DashboardLayout({ children }) {
  return (
    <body>
      <main>{children}</main>
    </body>
  );
}

export function AppLayout({ children }) {
  return (
    <body className="min-h-screen flex flex-col">
      <main className="flex-1">{children}</main>
    </body>
  );
}

// Function to create main content for docs
export function createDocsMainContent(content) {
  return (
    <main>
      <div className="container">
        {content}
      </div>
    </main>
  );
}

// Function to create dependency graph main content
export function createDependencyGraphMainContent(content) {
  return (
    <main>
      <table id="table-rotated">
        {content}
      </table>
    </main>
  );
}