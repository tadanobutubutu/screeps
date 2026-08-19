// main.js
import React from 'react';

const DependencyGraph = () => {
  return (
    <div>
      {/* Other existing content */}

      <table>
        <thead>
          <tr>
            <th scope="col"><div>src/constants.js</div></th>
            <th scope="col"><div>src/managers/roomManager.js</div></th>
            <th scope="col"><div>src/managers/spawnManager.js</div></th>
            <th scope="col"><div>src/managers/towerManager.js</div></th>
            <th scope="col"><div>src/roles/builder.js</div></th>
            {/* Add other table headers with scope="col" as needed */}
          </tr>
        </thead>
        <tbody>
          {/* Table body content */}
        </tbody>
      </table>

      {/* Rest of your existing code */}
    </div>
  );
};

export default DependencyGraph;