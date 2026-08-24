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

// Additional changes to address the REACT_027 issue
// Ensure that all <th> elements within the table have a scope attribute
// This is an example of how to modify the DependencyGraphComponent to include the scope attribute
// You will need to find and modify the actual table component in your codebase accordingly

DependencyGraphComponent = () => {
  return (
    <table>
      {/* ... other table elements ... */}
      <thead>
        <tr>
          <th scope="col"><div>src/constants.js</div></th>
          <th scope="col"><div>src/managers/roomManager.js</div></th>
          <th scope="col"><div>src/managers/spawnManager.js</div></th>
          <th scope="col"><div>src/managers/towerManager.js</div></th>
          {/* ... other headers ... */}
        </tr>
      </thead>
      <tbody>
        {/* ... table rows ... */}
      </tbody>
    </table>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));