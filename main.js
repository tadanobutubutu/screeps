// main.js
import React from 'react';

// ... existing code ...

// Example of how to fix the table structure
const DependencyGraphTable = () => {
  return (
    <table>
      <thead>
        <tr>
          <th scope="col">File</th>
          <th scope="col">Dependencies</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <th scope="row"><div>src/constants.js</div></th>
          <td>...</td>
        </tr>
        <tr>
          <th scope="row"><div>src/managers/roomManager.js</div></th>
          <td>...</td>
        </tr>
        {/* More rows with scope="row" for data headers */}
        {/* Add scope="col" to all header cells that are not rows */}
        <tr>
          <th scope="col"><div>src/managers/spawnManager.js</div></th>
          <td>...</td>
        </tr>
        <tr>
          <th scope="col"><div>src/managers/towerManager.js</div></th>
          <td>...</td>
        </tr>
        {/* ... other headers with scope="col" ... */}
      </tbody>
    </table>
  );
};

// ... rest of your existing code ...