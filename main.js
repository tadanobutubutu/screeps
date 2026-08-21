// Assuming other imports and code...

// Import the component that uses the problematic HTML
import DependencyGraph from './DependencyGraph';

// Update the component to replace the <a> with a <button>
const DependencyGraphComponent = () => {
  return (
    <main>
      {/* Other components and content */}
      <button id="unrotate" onClick={() => {/* Rotate back logic here */}}>rotate back</button>
      {/* Other components and content */}
      <DependencyGraph />
    </main>
  );
};

export default DependencyGraphComponent;

// Assuming other code...