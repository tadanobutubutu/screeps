import DependencyGraph from './DependencyGraph';

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