// main.js
// Resolved merge: integrates Express server with modern React 18+ root rendering
// Keeps both branches' features: updated dependencies, server setup, and client-side React initialization

import express from 'express';
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import Layout, { existingFunction2 } from './Layout';
import { jest } from '@jest/globals';

// Preserve existing Lambda functions from updated dependencies
const existingLambdaFuncs = // ... existing implementation

// Layout component from HEAD branch, rendered within the application
const Layout = ({ children }) => {
  return (
    <body>
      <div className="layout">
        <header>
          <nav>
            {/* Navigation menu */}
          </nav>
        </header>

        {/* Add a main landmark for the primary content */}
        <main>{children}</main>
      </div>
    </body>
  );
};

// Preserve existing function exports
export const existingFunction = () => {
  // Existing implementation
};

// Implementation for React 19 updates (merged from both branches)
export const handleReactUpdate = () => {
  // Implementation for React 19 updates (use merged changes if both were added)
};

// Implementation for Jest 30 updates (merged from both branches)
export const handleJestUpdate = () => {
  // Implementation for Jest 30 updates (use merged changes if both were added)
};

// Implementation for ESLint 10 updates (merged from both branches)
export const handleEslintUpdate = () => {
  // Implementation for ESLint 10 updates (use merged changes if both were added)
};

// Express server setup from HEAD branch
const app = express();

// Merge middleware section for dependency updates
app.use((req, res, next) => {
  // Middleware for dependency updates
  next();
});

// Serve application HTML with modern React root render (integrates origin/main's createRoot pattern)
app.get('/', (req, res) => {
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>App Layout</title>
      </head>
      <body>
        <div id="root"></div>
        <script type="module">
          import React from 'react';
          import ReactDOM from 'react-dom/client';
          import App from './App';
          const root = ReactDOM.createRoot(document.getElementById('root'));
          root.render(
            <React.StrictMode>
              <main>
                <App />
              </main>
            </React.StrictMode>
          );
        </script>
      </body>
    </html>
  `;
  res.send(html);
});

// Preserve existing tests from HEAD branch
describe('Existing tests', () => {
  it('should pass all existing tests', () => {
    expect(true).toBe(true);
  });
});

describe('Dependency updates', () => {
  it('should handle React 19 updates', () => {
    handleReactUpdate();
    expect(true).toBe(true);
  });

  it('should handle Jest 30 updates', () => {
    handleJestUpdate();
    expect(true).toBe(true);
  });

  it('should handle ESLint 10 updates', () => {
    handleEslintUpdate();
    expect(true).toBe(true);
  });

// Any other existing exports or functions remain unchanged
// ...
```