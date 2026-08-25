// Main module for Screeps documentation generation
// Handles table structure validation and rendering

/**
 * Generates a React table with proper scope attributes for accessibility
 */
function generateAccessibleTable() {
  const table = `
    <table>
      <caption>Screeps Game Objects and Properties</caption>
      <thead>
        <tr>
          <th scope="col">Object Type</th>
          <th scope="col">Properties</th>
          <th scope="col">Methods</th>
          <th scope="col">Description</th>
          <th scope="col">Example</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <th scope="row">Creep</th>
          <td>name, body, hits, fatigue</td>
          <td>move(), suicide(), pickup()</td>
          <td>Autonomous unit that can perform tasks</td>
          <td>Game.creeps['Harvester1']</td>
        </tr>
      </tbody>
    </table>
  `;
  
  // Export the generated table
  return table;
}

/**
 * Generates an accessible document wrapper with proper landmarks and language
 * @param {string} title - Page title for the landmark
 * @param {string} content - Main content to render
 * @returns {string} Accessible HTML document structure
 */
function generateAccessibleDocument(title, content) {
  const doc = `
    <html lang="en">
      <header role="banner">
        <nav role="navigation" aria-label="Main navigation">
          <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/docs">Documentation</a></li>
          </ul>
        </nav>
      </header>
      
      <main id="main-content" role="main" aria-labelledby="page-title">
        <h1 id="page-title">${title}</h1>
        ${content}
      </main>
      
      <footer role="contentinfo">
        <nav aria-label="Footer navigation">
          <a href="/privacy">Privacy Policy</a>
        </nav>
      </footer>
    </html>
  `;
  
  return doc;
}

/**
 * Generates an accessible SVG icon with proper naming
 * @param {string} type - Icon type (play, pause, stop)
 * @returns {string} Accessible SVG markup
 */
function generateAccessibleIcon(type) {
  const icons = {
    play: { viewBox: '0 0 24 24', path: 'M8 5v14l11-7z' },
    pause: { viewBox: '0 0 24 24', path: 'M6 19h4V5H6v14zm8-14v14h4V5h-4z' },
    stop: { viewBox: '0 0 24 24', path: 'M6 6h12v12H6z' }
  };
  
  const icon = icons[type] || icons.play;
  const label = type.charAt(0).toUpperCase() + type.slice(1);
  
  return `
    <svg 
      xmlns="http://www.w3.org/2000/svg"
      viewBox="${icon.viewBox}"
      role="img"
      aria-label="${label} button"
    >
      <title>${label}</title>
      <path d="${icon.path}" fill="currentColor" />
    </svg>
  `;
}

// Export for use in other modules
export { generateAccessibleTable, generateAccessibleDocument, generateAccessibleIcon };

// Example usage
const accessibleTable = generateAccessibleTable();
console.log(accessibleTable);

const doc = generateAccessibleDocument('Screeps API Reference', '<p>Content here</p>');
console.log(doc);

const playIcon = generateAccessibleIcon('play');
console.log(playIcon);