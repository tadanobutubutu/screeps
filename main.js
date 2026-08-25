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
          <th ...
          <th ...
          <th ...
          <th ...
          <th ...
        </tr>
      </thead>
      <tbody>
        <tr>
          <td scope="row"><div>Header Cell</div></td>
          <td ... Cell</div></td>
        </tr>
      </tbody>
    </table>
  `;
  
  // Export the generated table
  return table;
}

// Export for use in other modules
export { generateAccessibleTable };

// Example usage
const accessibleTable = generateAccessibleTable();
console.log(accessibleTable);