const handleRotateBack = () => {
  console.log('Rotating back...');
};

const DependencyGraph = () => {
  return (
    <div>
      {/* ... other components and logic ... */}
      <button id="unrotate" onClick={handleRotateBack}>rotate back</button>
      {/* ... other components and logic ... */}
    </div>
  );
};

ReactDOM.render(<DependencyGraph />, document.getElementById('root'));

// ... (existing code and exports)