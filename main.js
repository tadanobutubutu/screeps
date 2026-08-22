// Existing main.js content with conflict markers

// <<<<<<< HEAD
// Previous code that needs to be preserved
// ========

// Code that needs to be added or modified according to the issue:
// Adding aria-label to the SVG to provide an accessible name

// >>>>>>> branch-name
import React from 'react';

function App() {
  // Existing code that needs to be preserved
  // ...

  // Updated SVG component with aria-label for accessibility
  const IconSVG = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 100"
      aria-label="Screeps Dashboard"
    >
      <title>Screeps Dashboard</title>
      <text y="0.9em" fontSize="90">🐛</text>
    </svg>
  );

  return (
    // Existing JSX that needs to be preserved
    // ...
    <div>
      <IconSVG />
    </div>
  );
}

export default App;

// >>>>>>> branch-name