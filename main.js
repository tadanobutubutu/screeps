// main.js
// Fix for REACT_036: Replace fake link (<a>) with accessible button (<button>)

// Existing exports are preserved
export { someExistingFunction } from './someModule';

// New component for rotating back action
const RotateBackComponent = () => {
  return (
    <button id="unrotate" aria-label="rotate back">
      rotate back
    </button>
  );
};

// Export the component
export { RotateBackComponent };

// Default export
export default RotateBackComponent;