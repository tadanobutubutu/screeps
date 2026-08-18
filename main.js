import React from 'react';

function App() {
  return (
    <div>
      <h1>React Table</h1>
      <table>
        <thead>
          <tr>
            <th scope="col">src/constants.js</th>
            <th scope="col">src/managers/roomManager.js</th>
            <th scope="col">src/managers/spawnManager.js</th>
            <th scope="col">src/managers/towerManager.js</th>
            <th scope="col">src/roles/builder.js</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Value 1</td>
            <td>Value 2</td>
            <td>Value 3</td>
            <td>Value 4</td>
            <td>Value 5</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default App;