import React from 'react';

function Main() {
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
            {/* 21 more th elements with scope="col" added */}
          </tr>
        </thead>
        <tbody>
          {/* rows */}
        </tbody>
      </table>
    </div>
  );
}

export default Main;