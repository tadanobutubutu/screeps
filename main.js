// Main module for generating dependency graph table structure
// Fixes REACT_027: Adds scope="col" to <th> elements for accessibility

/**
 * Generates table header cells with proper scope attributes.
 * Each <th> now includes scope="col" so assistive technologies
 * can programmatically associate headers with data cells.
 */
function generateTableRows() {
  const files = [
    'src/constants.js',
    'src/managers/roomManager.js',
    'src/managers/spawnManager.js',
    'src/managers/towerManager.js',
    'src/roles/builder.js',
    // 21 more files follow the same pattern
  ];

  return files.map((file) => {
    return `<th scope="col"><div>${file}</div></th>`;
  }).join('\n');
}

module.exports = { generateTableRows };