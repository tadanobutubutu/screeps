// Main module for Screeps documentation generation
// Handles table structure validation and rendering

/**
 * Generates a React table with proper scope attributes for accessibility
 */
function generateAccessibleTable() {
  const table = `
    <table>
      <thead>
        <tr>
          <th scope="col"><div>src/constants.js</div></th>
          <th scope="col"><div>src/managers/roomManager.js</div></th>
          <th scope="col"><div>src/managers/spawnManager.js</div></th>
          <th scope="col"><div>src/managers/towerManager.js</div></th>
          <th scope="col"><div>src/roles/builder.js</div></th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td scope="row"><div>Header Cell</div></td>
          <td scope="row"><div>Data Cell</div></td>
        </tr>
      </tbody>
    </table>
  `;
  
  // Export the generated table
  return table;
}

// Replace the <a> with <button> for the 'rotate back' action
function generateRotateBackButton() {
  return `
    <button id="unrotate">rotate back</button>
  `;
}

// Export the functions for use in other modules
export { generateAccessibleTable, generateRotateBackButton };

// Example usage
const accessibleTable = generateAccessibleTable();
const rotateBackButton = generateRotateBackButton();
console.log(accessibleTable);
console.log(rotateBackButton);