// Assuming this is a React component that renders a table
import React from 'react';

const DependencyGraphTable = () => {
  return (
    <table>
      <thead>
        <tr>
          <th scope="col"><div>src/constants.js</div></th>
          <th scope="col"><div>src/managers/roomManager.js</div></th>
          <th scope="col"><div>src/managers/spawnManager.js</div></th>
          <th scope="col"><div>src/managers/towerManager.js</div></th>
          <th scope="col"><div>src/roles/builder.js</div></th>
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