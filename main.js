// [Your existing code from main.js goes here]
// Make sure to preserve all existing functions, exports, and code

// Add this new function to properly handle the table structure
function getDependencyGraphTable() {
  return `
    <table>
      <thead>
        <tr>
          <th scope="col"><div>src/constants.js</div></th>
          <th scope="col"><div>src/managers/roomManager.js</div></th>
          <th scope="col"><div>src/managers/spawnManager.js</div></th>
          <th scope="col"><div>src/managers/towerManager.js</div></th>
          <th scope="col"><div>src/roles/builder.js</div></th>
          <!-- Add other table headers with scope="col" as needed -->
        </tr>
      </thead>
      <tbody>
        <!-- Table body content goes here -->
      </tbody>
    </table>
  `;
}

// If you need to use this table in your application, you can export it
// module.exports.getDependencyGraphTable = getDependencyGraphTable;

// [Rest of your existing code from main.js goes here]