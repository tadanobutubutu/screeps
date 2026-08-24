// Main entry point for the Screeps bot repository
import React from 'react';
import ReactDOM from 'react-dom';
import DependencyGraphComponent from './components/DependencyGraphComponent';
import IndexComponent from './components/IndexComponent';

export default DependencyGraphComponent;
export { IndexComponent };

function App() {
  const handleRotateBack = () => {
    // Handle the rotate back action
  };

  return (
    <div>
      <DependencyGraphComponent />
      <IndexComponent />
      <button id="unrotate" className="icon-ccw unrotate" onClick={handleRotateBack} aria-label="rotate back">
        rotate back
      </button>
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById('root'));