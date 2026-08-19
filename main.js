// main.js
import React from 'react';

const DependencyGraph = () => {
  // ... existing code ...

  return (
    <div>
      {/* ... other content ... */}

      <table>
        <thead>
          <tr>
            <th scope="col"><div>src/constants.js</div></th>
            <th scope="col"><div>src/managers/roomManager.js</div></th>
            <th scope="col"><div>src/managers/spawnManager.js</div></th>
            <th scope="col"><div>src/managers/towerManager.js</div></th>
            <th scope="col"><div>src/roles/builder.js</div></th>
            {/* Add scope="col" to all other header cells */}
          </tr>
        </thead>
        <tbody>
          {/* ... table body content ... */}
        </tbody>
      </table>

      {/* ... rest of the component ... */}
    </div>
  );
};

export default DependencyGraph;