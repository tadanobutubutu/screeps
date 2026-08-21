// Example of a React component that renders a table
import React from 'react';

const DependencyGraphTable = () => {
  return (
    <table>
      <thead>
        <tr>
          <th scope="col">src/constants.js</th>
          <th scope="col">src/managers/roomManager.js</th>
          <th scope="col">src/managers/spawnManager.js</th>
          <th scope="col">src/managers/towerManager.js</th>
          <th scope="col">src/roles/builder.js</th>
          {/* ... other headers ... */}
        </tr>
      </thead>
      <tbody>
        {/* ... table rows ... */}
      </tbody>
    </table>
  );
};

export default DependencyGraphTable;