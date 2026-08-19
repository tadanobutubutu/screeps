// main.js
import React from 'react';
import { createRoot } from 'react-dom/client';

// Existing code (preserved)
const App = () => {
  return (
    <div className="app">
      <header>
        <h1>My App</h1>
      </header>
      <main>
        <p>Welcome to my application!</p>
      </main>
      <footer>
        <p>© 2023 My App</p>
      </footer>
    </div>
  );
};

// Existing exports (preserved)
export const existingFunction = () => {
  // Some existing functionality
};

export const anotherExistingFunction = () => {
  // Another existing function
};

// New function to handle main content (added for the issue)
export const renderMainContent = (content) => {
  return (
    <main>
      {content}
    </main>
  );
};

// Initialize the app
const container = document.getElementById('root');
const root = createRoot(container);
root.render(<App />);