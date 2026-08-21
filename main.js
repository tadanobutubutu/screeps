// Assuming main.js is a JSX file that might look something like this:

import React from 'react';

const DependencyGraph = () => {
  return (
    <table>
      <thead>
        <tr>
          <th scope="col"><div>src/constants.js</div></th>
          <th scope="col"><div>src/managers/roomManager.js</div></th>
          <th scope="col"><div>src/managers/spawnManager.js</div></th>
          <th scope="col"><div>src/managers/towerManager.js</div></th>
          // ... other headers
        </tr>
      </thead>
      <tbody>
        // ... table rows
      </tbody>
    </table>
  );
};

export default DependencyGraph;