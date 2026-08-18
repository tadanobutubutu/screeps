// main.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// Existing code remains unchanged
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

// New function to create main landmark for docs
export function DocsMain({ children }) {
  return (
    <main>
      {children}
    </main>
  );
}

// New function to create main landmark for dependency graph
export function DependencyGraphMain({ children }) {
  return (
    <main>
      <table id="table-rotated">
        {children}
      </table>
    </main>
  );
}

// New function to create main landmark for index page
export function IndexMain({ children }) {
  return (
    <main>
      <div className="container">
        {children}
      </div>
    </main>
  );
}