// main.js
import React from 'react';

const DependencyGraph = () => {
  return (
    <div>
      <table>
        <thead>
          <tr>
            <th scope="col"><div>src/constants.js</div></th>
            <th scope="col"><div>src/managers/roomManager.js</div></th>
            <th scope="col"><div>src/managers/spawnManager.js</div></th>
            <th scope="col"><div>src/managers/towerManager.js</div></th>
            <th scope="col"><div>src/roles/builder.js</div></th>
            {/* Add more headers with scope="col" as needed */}
          </tr>
        </thead>
        <tbody>
          {/* Table body content */}
        </tbody>
      </table>
    </div>
  );
};

export default DependencyGraph;