// main.js
import React from 'react';

// Preserve all existing code and exports
// ... (all original content remains unchanged)

// New function to replace the problematic link
const RotateBackButton = ({ onClick }) => {
  return (
    <button
      id="unrotate"
      onClick={onClick}
      className="rotate-back-button"
      aria-label="Rotate back"
    >
      rotate back
    </button>
  );
};

// Export all existing exports
// ... (all original exports remain unchanged)

// Example of how you might use the new component
// Replace the original <a href="#"> with this component
export const DependencyGraph = () => {
  // ... existing component code

  const handleRotateBack = () => {
    // Your rotation logic here
  };

  return (
    <div>
      {/* ... other content */}
      <RotateBackButton onClick={handleRotateBack} />
      {/* ... other content */}
    </div>
  );
};