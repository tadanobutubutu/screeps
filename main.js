// main.js
import React from 'react';

// Add language attribute to the root element
const App = () => {
  return (
    <div lang="en"> {/* Added lang attribute */}
      {/* Existing content */}
    </div>
  );
};

// Example of a properly structured table
const AccessibleTable = () => {
  return (
    <table>
      <caption>Table Caption</caption> {/* Added caption */}
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
  );
};

// Example of proper landmarks
const MainContent = () => {
  return (
    <main aria-label="Main Content"> {/* Added unique landmark */}
      {/* Main content here */}
    </main>
  );
};

// Example of accessible SVG
const AccessibleSVG = () => {
  return (
    <svg role="img" aria-label="Description of the image">
      {/* SVG content */}
    </svg>
  );
};

// Example of proper link
const ProperLink = () => {
  return (
    <a href="/destination" onClick={(e) => {
      // Only prevent default if it's a client-side navigation
      if (e.currentTarget.href === window.location.href) {
        e.preventDefault();
      }
    }}>
      Clickable Link
    </a>
  );
};

// Preserve all existing exports
export default App;
export { AccessibleTable, MainContent, AccessibleSVG, ProperLink };