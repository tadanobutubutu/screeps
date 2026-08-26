// Address accessibility issues from insight report
// TODO: Add back any required exports that might have been?
// (This comment remains as-is)

import React from 'react';

// Example component that renders the primary content
const PrimaryContent = () => {
  return (
    <div>
      {/* Your primary content goes here */}
      <h1 id="main-title">Example Title</h1>
      <p>Example paragraph of primary content...</p>

      {/* Adding an ARIA Landmark to the primary content for better accessibility */}
      <div role="region" aria-labelledby="region-title">
        {/* Render other accessibility-related components as needed */}
      </div>
    </div>
  );
};

// Your main component that will render the primary content wrapped in <main>
const MainComponent = () => {
  return (
    <main aria-labelledby="main-title">
      <PrimaryContent />
    </main>
  );
};

// Function to wrap the primary content in <main>
const wrapPrimaryContentInMain = (Component) => {
  return () => {
    return (
      <main>
        <Component />
      </main>
    );
  };
};

// Export the PrimaryContent component so it can be imported independently
export { PrimaryContent };

// Export the wrapPrimaryContentInMain function for usage elsewhere
export { wrapPrimaryContentInMain };

// Wrap the PrimaryContent component by default when exported
export default wrapPrimaryContentInMain(PrimaryContent);