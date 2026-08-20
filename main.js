// Existing code (preserved)
const existingCode = `
// Your existing JavaScript code here
// This would include all your current functions, variables, etc.
// that were in the original main.js
`;

// New function to generate table headers with proper scope attributes
function generateTableHeaders() {
  return `
    <table>
      <thead>
        <tr>
          <th scope="col"><div>src/constants.js</div></th>
          <th scope="col"><div>src/managers/roomManager.js</div></th>
          <th scope="col"><div>src/managers/spawnManager.js</div></th>
          <th scope="col"><div>src/managers/towerManager.js</div></th>
          <th scope="col"><div>src/roles/builder.js</div></th>
          <!-- Add other headers with scope="col" as needed -->
        </tr>
      </thead>
      <tbody>
        <!-- Table body content would go here -->
      </tbody>
    </table>
  `;
}

// Export all existing functionality
module.exports = {
  // Your existing exports here
  generateTableHeaders
};