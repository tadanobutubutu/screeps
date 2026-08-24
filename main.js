// main.js

// Helper function to create an accessible SVG element
function createAccessibleSVG(iconData, ariaLabel) {
  return {
    __html: iconData,
    ariaLabel: ariaLabel,
    role: 'img',
    'aria-hidden': 'true',
  };
}

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

// Example usage
const accessibleTable = generateAccessibleTable();
console.log(accessibleTable);

// Export for use in other modules
export { createAccessibleSVG, generateAccessibleTable };