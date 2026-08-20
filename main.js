import React from 'react';
import ReactDOM from 'react-dom';

// Function to handle the rotate back action
const handleRotateBack = () => {
  // Implement the action that should be performed when rotating back
  // This could be a state update, calling a function, or any other logic
  console.log('Rotating back...');
};

const Layout = () => {
  return (
    <div>
      {/* Other content */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        {/* SVG content */}
      </svg>
      {/* Other content */}
    </div>
  );
};

// Main component with a button instead of a fake link
const DependencyGraph = () => {
  return (
    <div>
      {/* ... other components and logic ... */}
      <button id="unrotate" onClick={handleRotateBack}>rotate back</button>
      {/* ... other components and logic ... */}
    </div>
  );
};

// Render the component
ReactDOM.render(<DependencyGraph />, document.getElementById('root'));

// ... (existing code and exports)

export default Layout;