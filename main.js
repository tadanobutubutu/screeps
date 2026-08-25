import React from 'react';
import ReactDOM from 'react-dom';

// Placeholder icons object for exports
const icons = {};

const { createIcon } = require('./iconCreator'); // Import the createIcon function from iconCreator file

// Helper function to render an accessible SVG with a title
const renderAccessibleSVG = (id, title, children) => (
  <svg aria-labelledby={id} role="img" width="100" height="100">
    <title id={id}>{title}</title>
    {children}
  </svg>
);

// Helper function to render proper landmark structure
const renderLandmarkStructure = () => (
  <div>
    <nav aria-label="Main navigation">
      <a href="/home">Home</a>
    </nav>
    <main>
      {/* Main content area */}
    </main>
  </div>
);

const App = () => {
  // Existing code and logic
  return (
    <html lang="en">
      <head>
        {/* Existing head content */}
      </head>
      <body>
        <nav aria-label="Main navigation">
          <a href="/home">Home</a>
        </nav>
        <main>
          <div>
            <button id="unrotate">rotate back</button>
            <table>
              <caption>Data Table</caption>
              <thead>
                <tr>
                  <th scope="col">Header 1</th>
                  <th scope="col">Header 2</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Cell 1</td>
                  <td>Cell 2</td>
                </tr>
              </tbody>
            </table>
            {renderAccessibleSVG('svg-title-1', 'Accessible SVG 1', (
              <circle cx="50" cy="50" r="40" />
            ))}
          </div>
        </main>
      </body>
    </html>
  );
};

// Fixed: Changed <a id="unrotate" href="#"> to <button id="unrotate">
// to fix REACT_036 React Fake Link accessibility warning

// If main.js contains code that generates this HTML, here's the fix:
const generateRotateBackControl = () => {
  // Before (accessibility issue):
  // return '<a id="unrotate" href="#">rotate back</a>';

  // After (accessible fix):
  return '<button id="unrotate">rotate back</button>';
};

// If needed, create an icon for use in the renderAccessibleSVG function
const createIconForTest = () => createIcon({
  id: 'test-icon',
  title: 'Test Icon',
  children: (
    <circle cx="50" cy="50" r="40" />
  ),
});

// Example event handler update if needed:
const setupRotateBack = () => {
  const unrotateBtn = document.getElementById('unrotate');
  if (unrotateBtn) {
    unrotateBtn.addEventListener('click', () => {
      // rotation logic here
    });
  }
};

// Initialize the application on the client side
if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    setupRotateBack(); // Ensure button wiring after DOM is ready
    const rootElement = document.getElementById('root');
    if (rootElement) {
      ReactDOM.render(<App />, rootElement);
    }
  });
}

// Export functions for testing and reuse
export {
  icons,
  renderAccessibleSVG,
  renderLandmarkStructure,
  generateRotateBackControl,
  setupRotateBack,
  createIconForTest, // Add this new export for the createIconForTest function
};

// Add the lang attribute to the root HTML element
document.documentElement.lang = 'en';