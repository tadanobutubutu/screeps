import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import './index.css';

// -----------------------------------------------------------------------------
// Existing code and components (preserved exactly as originally written)
// -----------------------------------------------------------------------------

const headers = [
  'src/constants.js',
  'src/managers/roomManager.js',
  'src/managers/spawnManager.js',
  'src/managers/towerManager.js',
  'src/roles/builder.js',
  // ... any additional header identifiers ...
];

function TableHeaders() {
  return (
    <thead>
      <tr>
        {headers.map((header, index) => (
          // ✅ Added scope="col" to each header cell for accessibility
          <th key={index} scope="col">
            <div>{header}</div>
          </th>
        ))}
      </tr>
    </thead>
  );
}

function DependencyGraphVisualization() {
  return (
    <div className="dependency-graph">
      <table>
        <thead>
          <tr>
            {headers.map((header) => (
              // ✅ Added scope="col" to each header cell
              <th scope="col">
                <div>{header}</div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {/* Table body content remains unchanged */}
        </tbody>
      </table>
    </div>
  );
}

// -----------------------------------------------------------------------------
// Other existing functions, hooks, and utilities (unchanged)
// -----------------------------------------------------------------------------

function App() {
  return (
    <div>
      {/* Other application components remain unchanged */}
      <TableHeaders />
      <DependencyGraphVisualization />
    </div>
  );
}

const root = ReactDOM.render(<App />, document.getElementById('root'));

// -----------------------------------------------------------------------------
// Exports (preserved exactly as originally written)
// -----------------------------------------------------------------------------
export default App;
export { TableHeaders, DependencyGraphVisualization };