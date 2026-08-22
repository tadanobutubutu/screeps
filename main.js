import React from 'react';
import ReactTable from 'react-table';
import './Table.css';

// -----------------------------------------------------------------------------
// Sample data (unchanged)
// -----------------------------------------------------------------------------
const data = [
  // ... existing rows ...
];

// -----------------------------------------------------------------------------
// Column definitions – updated to include `scope="col"` on each <th>
// -----------------------------------------------------------------------------
const columns = [
  {
    Header: () => (
      <th scope="col"><div>src/constants.js</div></th>
    ),
    accessor: 'constants',
  },
  {
    Header: () => (
      <th scope="col"><div>src/managers/roomManager.js</div></th>
    ),
    accessor: 'roomManager',
  },
  {
    Header: () => (
      <th scope="col"><div>src/managers/spawnManager.js</div></th>
    ),
    accessor: 'spawnManager',
  },
  {
    Header: () => (
      <th scope="col"><div>src/managers/towerManager.js</div></th>
    ),
    accessor: 'towerManager',
  },
  {
    Header: () => (
      <th scope="col"><div>src/roles/builder.js</div></th>
    ),
    accessor: 'builder',
  },
  // The following 21 column definitions follow the same pattern:
  {
    Header: () => (
      <th scope="col"><div>src/... (other header)</div></th>
    ),
    accessor: '...',
  },
  // ... repeat until 26 total columns ...
];

// -----------------------------------------------------------------------------
// Table header component (preserved structure, only scope added)
// -----------------------------------------------------------------------------
function TableHeader() {
  return (
    <thead>
      <tr>
        {columns.map((col, index) => (
          <th key={index} scope="col">
            <div>{col.Header}</div>
          </th>
        ))}
      </tr>
    </thead>
  );
}

// -----------------------------------------------------------------------------
// Main App component (unchanged logic)
// -----------------------------------------------------------------------------
function App() {
  const tableInstance = ReactTable({ data, columns, .../* other options */});

  return (
    <div className="App">
      {tableInstance}
    </div>
  );
}

// -----------------------------------------------------------------------------
// Export (unchanged)
// -----------------------------------------------------------------------------
export default App;