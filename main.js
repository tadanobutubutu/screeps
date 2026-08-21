// main.js

// ... (existing code and exports)

// Import necessary React components
import React from 'react';
import ReactDOM from 'react-dom';

// Function to handle the rotate back action
const handleRotateBack = () => {
  // Implement the action that should be performed when rotating back
  // This could be a state update, calling a function, or any other logic
  console.log('Rotating back...');
};

// Main component with proper accessibility - button instead of fake link
const DependencyGraph = () => {
  return (
    <main>
      <div>
        {/* ... other components and logic ... */}
        <button 
          id="unrotate" 
          type="button"
          onClick={handleRotateBack}
          aria-label="Rotate back"
        >
          Rotate back
        </button>
        {/* ... other components and logic ... */}
      </div>
    </main>
  );
};

// Render the component
... />, ...

// ... (existing code and exports)