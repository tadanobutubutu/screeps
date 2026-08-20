// main.js
import React from 'react';

// Example component with accessibility improvements
const AccessibleComponent = () => {
  // REACT_015: Add lang attribute to root element
  return (
    <div lang="en">
      {/* REACT_017: Add proper landmarks */}
      <header role="banner">
        <h1>Website Title</h1>
      </header>

      <main role="main">
        {/* REACT_027: Proper table structure with caption and scope */}
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
              <td>Data 1</td>
              <td>Data 2</td>
            </tr>
          </tbody>
        </table>

        {/* REACT_041: SVG with accessible name */}
        <svg aria-label="Decorative icon" role="img">
          <circle cx="50" cy="50" r="40" fill="red" />
        </svg>

        {/* REACT_036: Avoid fake links - use button or proper link */}
        <button onClick={() => console.log('Button clicked')}>Click Me</button>

        {/* REACT_025: Unique landmarks */}
        <nav aria-label="Primary navigation">
          {/* Navigation content */}
        </nav>
      </main>

      <footer role="contentinfo">
        {/* Footer content */}
      </footer>
    </div>
  );
};

// Preserve all existing exports
export const existingFunction = () => {
  // Your existing code here
};

export const anotherExistingFunction = () => {
  // Your existing code here
};

// Add any new accessibility-related functions here
export const getAccessibleColorContrast = (color1, color2) => {
  // Function to calculate color contrast for accessibility
  // Implementation would go here
};