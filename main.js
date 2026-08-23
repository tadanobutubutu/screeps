// Main entry point for the Screeps bot repository
import React from 'react';
import ReactDOM from 'react-dom';
import DependencyGraphComponent from './components/DependencyGraphComponent';
import IndexComponent from './components/IndexComponent';

export default DependencyGraphComponent;
export default IndexComponent;

function App() {
  return (
    <div>
      <DependencyGraphComponent />
      <IndexComponent />
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById('root'));