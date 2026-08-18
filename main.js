// main.js
import React from 'react';

const DependencyGraph = () => {
  return (
    <div>
      <table>
        <thead>
          <tr>
            <th scope="col">File</th>
            <th scope="col">Dependencies</th>
            <th scope="col">Type</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>src/constants.js</td>
            <td>None</td>
            <td>Configuration</td>
          </tr>
          <tr>
            <td>src/managers/roomManager.js</td>
            <td>src/constants.js</td>
            <td>Manager</td>
          </tr>
          <tr>
            <td>src/managers/spawnManager.js</td>
            <td>src/constants.js, src/managers/roomManager.js</td>
            <td>Manager</td>
          </tr>
          <tr>
            <td>src/managers/towerManager.js</td>
            <td>src/constants.js, src/managers/roomManager.js</td>
            <td>Manager</td>
          </tr>
          <tr>
            <td>src/roles/builder.js</td>
            <td>src/constants.js, src/managers/roomManager.js</td>
            <td>Role</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default DependencyGraph;