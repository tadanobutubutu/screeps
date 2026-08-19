import React from 'react';

function DependencyGraph() {
  return (
    <div>
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
          <tr>
            <td>Used by other modules</td>
            <td>Used by other modules</td>
            <td>Used by other modules</td>
            <td>Used by other modules</td>
            <td>Used by other modules</td>
            {/* ... other data cells ... */}
          </tr>
          {/* ... other rows ... */}
        </tbody>
      </table>
    </div>
  );
}

export default DependencyGraph;