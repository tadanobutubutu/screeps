// Assuming other imports and code...

// Import the component that uses the problematic SVG
import DependencyGraph from './DependencyGraph';

// Update the component to add an accessible name to the SVG
const DependencyGraphComponent = () => {
  return (
    <div>
      {/* Other components and content */}
      <button id="unrotate" onClick={() => {/* Rotate back logic here */}}>rotate back</button>
      {/* Other components and content */}
      <svg
        aria-label="Dependency graph"
        viewBox="0 0 100 100"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* SVG content */}
      </svg>
    </div>
  );
};

export default DependencyGraphComponent;

// Assuming other code...