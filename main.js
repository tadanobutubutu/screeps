// main.js

// React component for rendering the dependency graph table with proper accessibility
import React from 'react';

const DependencyGraphTable = ({ rows }) => {
  return (
    <table>
      <thead>
        <tr>
          <th scope="col"><div>src/constants.js</div></th>
          <th scope="col"><div>src/managers/roomManager.js</div></th>
          <th scope="col"><div>src/managers/spawnManager.js</div></th>
          <th scope="col"><div>src/managers/towerManager.js</div></th>
          <th scope="col"><div>src/roles/builder.js</div></th>
          {/* Add the rest of the column headers with scope="col" */}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, index) => (
          <tr key={index}>
            <td><div>{row.filePath}</div></td>
            {/* Add data cells */}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

// Additional code and exports
// ...

export { DependencyGraphTable };