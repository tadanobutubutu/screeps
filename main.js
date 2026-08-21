import DependencyGraph from './DependencyGraph';

const DependencyGraphComponent = () => {
  return (
    <main>
      {/* Other components and content */}
      <button id="unrotate" onClick={() => {/* Rotate back logic here */}}>rotate back</button>
      {/* Other components and content */}
      <DependencyGraph />
      {/* Add ARIA attributes to improve accessibility */}
      <div role="button" id="unrotate" aria-pressed="false" onClick={() => {/* Rotate back logic here */}}>rotate back</div>
    </main>
  );
};

// Re-adding the missing export for DependencyGraphComponent
export { DependencyGraphComponent as default };