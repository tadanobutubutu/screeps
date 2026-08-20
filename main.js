// main.js
import React from 'react';
import ReactDOM from 'react-dom';

// Add lang attribute to the HTML element (REACT_015)
document.documentElement.lang = 'en';

// Improved table structure (REACT_027)
const AccessibleTable = ({ data }) => (
  <table>
    <caption>Data Table</caption>
    <thead>
      <tr>
        <th scope="col">Header 1</th>
        <th scope="col">Header 2</th>
      </tr>
    </thead>
    <tbody>
      {data.map((row, index) => (
        <tr key={index}>
          <td>{row.col1}</td>
          <td>{row.col2}</td>
        </tr>
      ))}
    </tbody>
  </table>
);

// Proper landmarks (REACT_017)
const App = () => (
  <div>
    <header role="banner">
      <h1>Application Header</h1>
    </header>
    <main role="main">
      {/* Your main content here */}
    </main>
    <footer role="contentinfo">
      <p>Footer content</p>
    </footer>
  </div>
);

// Accessible SVG (REACT_041)
const AccessibleSVG = () => (
  <svg role="img" aria-label="Description of the image">
    {/* SVG content */}
  </svg>
);

// Unique landmarks (REACT_025)
const UniqueLandmarks = () => (
  <div>
    <nav aria-label="Primary navigation">
      {/* Navigation links */}
    </nav>
    <nav aria-label="Secondary navigation">
      {/* Additional navigation links */}
    </nav>
  </div>
);

// Fix fake links (REACT_036)
const RealLink = ({ href, children }) => {
  if (!href) {
    return <span>{children}</span>;
  }
  return <a href={href}>{children}</a>;
};

// Preserve all existing exports
export const existingFunction1 = () => {
  // Existing code
};

export const existingFunction2 = () => {
  // Existing code
};

// Add new accessibility components
export {
  AccessibleTable,
  App,
  AccessibleSVG,
  UniqueLandmarks,
  RealLink
};

// Main render
ReactDOM.render(<App />, document.getElementById('root'));