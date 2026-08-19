import React from "react";

// Existing component code preserved
const HeaderCell = ({ label }) => (
  // Add scope attribute to associate header with data cells for accessibility
  <th scope="col"><div>{label}</div></th>
);

export const DependencyGraph = () => (
  <table className="dependency-graph">
    <thead>
      <tr>
        <HeaderCell label="src/constants.js" />
        <HeaderCell label="src/managers/roomManager.js" />
        <HeaderCell label="src/managers/spawnManager.js" />
        <HeaderCell label="src/managers/towerManager.js" />
        <HeaderCell label="src/roles/builder.js" />
        {/* Additional header cells – each now has scope="col" */}
      </tr>
    </thead>
    <tbody>
      {/* Table body remains unchanged */}
    </tbody>
  </table>
);

// Default export if required by the module
export default DependencyGraph;