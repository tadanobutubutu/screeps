// Assuming this is a part of a React component file
import React from 'react';

function DependencyGraphTable() {
  return (
    <table>
      <thead>
        <tr>
          {/* Add scope attribute to each <th> element */}
          <th scope="col"><div>src/constants.js</div></th>
          <th scope="col"><div>src/managers/roomManager.js</div></th>
          <th scope="col"><div>src/managers/spawnManager.js</div></th>
          <th scope="col"><div>src/managers/towerManager.js</div></th>
          {/* ... other <th> elements ... */}
        </tr>
      </thead>
      <tbody>
        {/* Table rows */}
      </tbody>
    </table>
  );
}

export default DependencyGraphTable;