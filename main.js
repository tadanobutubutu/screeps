import React from 'react';

// -----------------------------------------------------------------------------
// Existing imports, components, and helpers (preserved unchanged)
// -----------------------------------------------------------------------------

// Example existing component that renders a table with header cells
// The original code used <th> without a scope attribute; we now add scope="col"
const HeaderCell = ({ children }) => (
  <th scope="col">
    <div>{children}</div>
  </th>
);

// The table component that was flagged by the accessibility rule
// All <th> elements now have the required scope attribute
export const DependencyGraphTable = () => (
  <table className="dependency-graph">
    <thead>
      <tr>
        <HeaderCell>src/constants.js</HeaderCell>
        <HeaderCell>src/managers/roomManager.js</HeaderCell>
        <HeaderCell>src/managers/spawnManager.js</HeaderCell>
        <HeaderCell>src/managers/towerManager.js</HeaderCell>
        <HeaderCell>src/roles/builder.js</HeaderCell>
        {/* ... other header cells (total 26) ... */}
      </tr>
    </thead>
    <tbody>
      {/* table body remains unchanged */}
    </tbody>
  </table>
);

// -----------------------------------------------------------------------------
// Export statements (preserved as‑is)
// -----------------------------------------------------------------------------
export default DependencyGraphTable;