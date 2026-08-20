import React from 'react';

function HeaderCell({ children }) {
  return (
    <th scope="col">
      <div>{children}</div>
    </th>
  );
}

function DependencyGraphHeaders() {
  return (
    <thead>
      <tr>
        <HeaderCell>src/constants.js</HeaderCell>
        <HeaderCell>src/managers/roomManager.js</HeaderCell>
        <HeaderCell>src/managers/spawnManager.js</HeaderCell>
        <HeaderCell>src/managers/towerManager.js</HeaderCell>
        <HeaderCell>src/roles/builder.js</HeaderCell>
        {/* 21 additional HeaderCell components follow the same pattern */}
      </tr>
    </thead>
  );
}

function DependencyGraph() {
  return (
    <div>
      <DependencyGraphHeaders />
      {/* other parts of the dependency graph visualization */}
    </div>
  );
}

export default DependencyGraph;