// main.js

// Simulating the content of main.js where JSX or HTML strings are returned for rendering
function renderDependencyGraph() {
  // Simulated JSX/HTML content
  return `
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
        <!-- Table rows would go here -->
      </tbody>
    </table>
  `;
}

// ... other code in main.js ...

// You would call this function where you need to render the table
const dependencyGraphHTML = renderDependencyGraph();
// Assuming this is where you render the HTML to the DOM or server
document.body.innerHTML = dependencyGraphHTML;