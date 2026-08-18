// main.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// Existing code (preserved)
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// New function to handle layout with main landmark
export function LayoutWithMain({ children }) {
  return (
    <body className="min-h-screen flex flex-col">
      <main className="flex-1">{children}</main>
    </body>
  );
}

// New function to handle documentation pages with main landmark
export function DocPageWithMain({ children }) {
  return (
    <main>
      <div className="container">
        {children}
      </div>
    </main>
  );
}

// New function to handle dependency graph with main landmark
export function DependencyGraphWithMain({ children }) {
  return (
    <main>
      <table id="table-rotated">
        {children}
      </table>
    </main>
  );
}