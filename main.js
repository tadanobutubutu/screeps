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
    <div className="min-h-screen flex flex-col">
      <header className="flex flex-col items-left bg-gray-50 p-4 fixed w-full h-20 z-10">
        {/* navbar */}
        <svg aria-hidden="true" className="hidden">
          <title>Decorative element</title>
        </svg>
      </header>
      <main className="flex-1">
        {children}
      </main>
    </div>
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