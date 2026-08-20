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
      </tbody>
    </table>
  );
};

// ... rest of your existing code ...