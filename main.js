// main.js
import React from 'react';

/**
 * Handles the rotation back action for the dependency graph
 */
const handleRotateBack = () => {
  // Implement your rotation logic here
  console.log('Rotating back to original view');
};

// Add language attribute to React components
export const App = () => {
  return (
    <div lang="en"> {/* Add language attribute */}
      <h1>Accessible Application</h1>
      <main> {/* Proper landmark */}
        <AccessibleTable />
        <AccessibleSVG />
        <AccessibleLink />
        <DependencyGraph />
      </main>
    </div>
  );
};

/**
 * Component for the dependency graph visualization
 */
const DependencyGraph = () => {
  return (
    <div className="dependency-graph">
      {/* Other graph elements */}
      <button
        id="unrotate"
        onClick={handleRotateBack}
        aria-label="Rotate back to original view"
      >
        rotate back
      </button>
    </div>
  );
};

// Proper table structure with headers
export const AccessibleTable = () => {
  return (
    <table>
      <thead>
        <tr>
          <th scope="col">Name</th>
          <th scope="col">Age</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>John Doe</td>
          <td>30</td>
        </tr>
      </tbody>
    </table>
  );
};

// Accessible SVG with title and description
export const AccessibleSVG = () => {
  return (
    <svg role="img" aria-label="Example graphic" width="100" height="100">
      <title>Example Graphic</title>
      <desc>This is an example graphic showing a simple shape</desc>
      <circle cx="50" cy="50" r="40" fill="blue" />
    </svg>
  );
};

// Unique landmarks
export const AccessibleLink = () => {
  return (
    <a href="#main-content" onClick={(e) => {
      e.preventDefault();
      document.getElementById('main-content').focus();
    }}>
      Skip to main content
    </a>
  );
};

// Add this to your main component
export const MainContent = () => {
  return (
    <main id="main-content" tabIndex="-1">
      {/* Your main content here */}
    </main>
  );
};

export default App;