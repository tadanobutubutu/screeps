// main.js - generates dependency graph HTML with accessible table headers
function generateDependencyGraph() {
  const headers = [
    'src/constants.js',
    'src/managers/roomManager.js',
    'src/managers/spawnManager.js',
    'src/managers/towerManager.js',
    'src/roles/builder.js'
    // ... other headers
  ];
  const headerHtml = headers.map(h => `<th scope="col"><div>${h}</div></th>`).join('');
  return `
    <table>
      <thead>
        <tr>
          ${headerHtml}
        </tr>
      </thead>
      <tbody>
        <!-- data rows -->
      </tbody>
    </table>
  `;
}
module.exports = { generateDependencyGraph };