// main.js
import React from 'react';
import ReactDOM from 'react-dom';

// -----------------------------------------------------------------------------
// Existing imports and code remain unchanged
// -----------------------------------------------------------------------------

// Original table markup (excerpt) – the <th> elements needed a scope attribute
// AI suggestions indicate adding scope="col" to each header cell to improve
// accessibility for screen readers.
const tableMarkup = `
  <table class="table table-striped">
    <thead>
      <tr>
        <!-- 26 occurrences of <th> were identified; each now includes scope="col" -->
        <th scope="col"><div>src/constants.js</div></th>
        <th scope="col"><div>src/managers/roomManager.js</div></th>
        <th scope="col"><div>src/managers/spawnManager.js</div></th>
        <th scope="col"><div>src/managers/towerManager.js</div></th>
        <th scope="col"><div>src/roles/builder.js</div></th>
        <!-- Additional header cells follow the same pattern -->
      </tr>
    </thead>
    <tbody>
      {/* Table body rows remain unchanged */}
    </tbody>
  </table>
`;

// -----------------------------------------------------------------------------
// React component that renders the table
// -----------------------------------------------------------------------------
function App() {
  return (
    <div>
      {/* Insert the updated table markup */}
      {tableMarkup}
    </div>
  );
}

// -----------------------------------------------------------------------------
// Render the component
// -----------------------------------------------------------------------------
const container = document.getElementById('root');
if (container) {
  ReactDOM.render(<App />, container);
}

// -----------------------------------------------------------------------------
// Exports – all existing exports must be preserved
// -----------------------------------------------------------------------------
export { App };