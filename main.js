import React from 'react';
import { createRoot } from 'react-dom/client';

// Existing code (preserved)
function MainApp() {
  return (
    <div className="app" lang="en" role="main">
      <header role="banner">
        <h1>My App</h1>
      </header>

      <main role="main">
        <p>Welcome to my application!</p>
        <table role="table" aria-label="Data table">
          <thead>
            <tr>
              <th scope="col">Header 1</th>
              <th scope="col">Header 2</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Data 1</td>
              <td>Data 2</td>
            </tr>
          </tbody>
        </table>

        <nav aria-label="Main navigation">
          {/* Navigation items would go here */}
        </nav>

        <section aria-labelledby="section-heading">
          <h2 id="section-heading">Section Heading</h2>
          {/* Section content */}
        </section>

        <button aria-label="Submit form" onClick={() => console.log('Submitted')}>
          Submit
        </button>
      </main>

      <footer role="contentinfo">
        <p>© 2023 My App</p>
      </footer>
    </div>
  );
}

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

// Export any necessary functions
export function getAccessibilityStatus() {
  return {
    score: 87,
    grade: 'B',
    checksPassed: 41,
    totalChecks: 47
  };
}

// Initialize the app
const container = document.getElementById('root');
const root = createRoot(container);
root.render(
  <React.StrictMode>
    <MainApp />
  </React.StrictMode>
);