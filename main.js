import React from 'react';
import './docs/dependency-graph.html'; // Assuming this is how you import the HTML file

const DependencyGraph = () => {
  return (
    <div>
      {/* Render the HTML content from the file */}
      <html>
        <head>
          <title>Dependency Graph</title>
        </head>
        <body>
          {/* Replace the following with the actual HTML content */}
          <table>
            <thead>
              <tr>
                <th scope="col"><div>src/constants.js</div></th>
                <th scope="col"><div>src/managers/roomManager.js</div></th>
                <th scope="col"><div>src/managers/spawnManager.js</div></th>
                <th scope="col"><div>src/managers/towerManager.js</div></th>
                {/* ... other headers ... */}
              </tr>
            </thead>
            <tbody>
              {/* ... table rows ... */}
            </tbody>
          </table>
        </body>
      </html>
    </div>
  );
};

export default DependencyGraph;