import React from 'react';
import { Link } from 'react-router-dom';

function initialize() {
  console.log('Application initialized');
}

// Accessibility helper functions
export function setA11yLabels(element, label) {
  if (element && label) {
    element.setAttribute('aria-label', label);
  }
}

export function addA11yRole(element, role) {
  if (element) {
    element.setAttribute('role', role);
  }
}

// Corrected React component
const App = () => {
  return (
    <div>
      {/* Fixed: Added 'role="button"' to the anchor element */}
      <a href="/home" role="button">Home</a>

      <table>
        {/* Fixed: Added table headers */}
        <thead>
          <tr>
            <th>Column 1</th>
            <th>Column 2</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Column 1</td>
            <td>Column 2</td>
          </tr>
        </tbody>
      </table>

      {/* Fixed: Added an accessible name to the SVG */}
      <svg>
        <title>Accessible circle</title>
        <circle cx="50" cy="50" r="40" />
      </svg>

      {/* Fixed: Ensured landmark roles are unique */}
      <main id="main-content">
        <nav id="site-navigation">
          <a href="/home" role="button">Navigation</a>
        </nav>
      </main>

      {/* Fixed: Added 'role="button"' to the React Router link */}
      <Link to="/about" role="button">About</Link>
    </div>
  );
};

export default App;