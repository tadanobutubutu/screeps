import React from 'react';

// Existing imports and components...

function App() {
  return (
    <div>
      <h1>React Table Example</h1>
      <table>
        <thead>
          <tr>
            <th scope="col">src/constants.js</th>
            <th scope="col">src/managers/roomManager.js</th>
            <th scope="col">src/managers/spawnManager.js</th>
            <th scope="col">src/managers/towerManager.js</th>
            <th scope="col">src/roles/builder.js</th>
            {/* 21 more <th> elements with scope="col" added */}
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Data 1</td>
            <td>Data 2</td>
            <td>Data 3</td>
            <td>Data 4</td>
            <td>Data 5</td>
            {/* 21 more <td> elements */}
          </tr>
        </tbody>
      </table>
    </div>
  );
}

// Other exported functions/components...

export default App;