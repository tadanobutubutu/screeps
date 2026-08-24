import React from 'react';

const DependencyGraph = () => {
  return (
    <div>
      {/* ... other content ... */}
      <table>
        <thead>
          <tr>
            {/* ... other header cells ... */}
            <th scope="col"><div>src/constants.js</div></th>
            <th scope="col"><div>src/managers/roomManager.js</div></th>
            <th scope="col"><div>src/managers/spawnManager.js</div></th>
            <th scope="col"><div>src/managers/towerManager.js</div></th>
            <th scope="col"><div>src/roles/builder.js</div></th>
            {/* ... other header cells ... */}
          </tr>
        </thead>
        <tbody>
          {/* ... other table rows ... */}
        </tbody>
      </table>
      {/* ... other content ... */}
    </div>
  );
};

export default DependencyGraph;