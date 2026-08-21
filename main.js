const fs = require('fs');
const path = require('path');

// Function to update the <th> elements with the scope attribute
function updateTableHeaders(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const updatedContent = content.replace(/<th>/g, '<th scope="col">');
  fs.writeFileSync(filePath, updatedContent, 'utf8');
}

// Function to add <main> landmark for accessibility (REACT_017)
function addMainLandmark(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  
  // Check if main tag already exists
  if (content.includes('<main>') && content.includes('</main>')) {
    return;
  }
  
  let updatedContent = content;
  
  // Remove any existing unclosed main tags
  updatedContent = updatedContent.replace(/<main>/g, '');
  updatedContent = updatedContent.replace(/<\/main>/g, '');
  
  // Strategy: Wrap content starting from the first significant content element
  // until just before </body>
  // For docs/index.html - find the table-rotated section
  if (content.includes('id="table-rotated"')) {
    // Wrap from table to </table>
    updatedContent = content
      .replace(/<table id="table-rotated">/, '<main>\n        <table id="table-rotated">')
      .replace(/<\/table>/, '</table>\n    </main>');
  }
  // For links/container section
  else if (content.includes('class="container"') && content.includes('class="links"')) {
    // Wrap the container div
    updatedContent = content
      .replace(/<div class="container">/, '<main>\n        <div class="container">')
      .replace('</div>\n    </body>', '</div>\n    </main>\n</body>')
      .replace('</div>\n</body>', '</div>\n    </main>\n</body>');
  }
  // Fallback: wrap everything between <body> and </body>
  else {
    updatedContent = content
      .replace('<body>', '<body>\n    <main>')
      .replace('</body>', '    </main>\n</body>');
  }
  
  fs.writeFileSync(filePath, updatedContent, 'utf8');
}

// Function to fix React Fake Link (REACT_036) - replace <a href="#"> with <button>
function fixFakeLinks(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  let updatedContent = content;

  // Match <a href="#">...</a> patterns and replace with <button>
  // This handles: <a id="unrotate" href="#">rotate back</a>
  updatedContent = updatedContent.replace(/<a([^>]*?)href="#"([^>]*?)>(.*?)<\/a>/gi, (match, beforeHref, afterHref, text) => {
    // Remove href attribute and convert to button
    const combinedAttrs = beforeHref + afterHref;
    return `<button${combinedAttrs}>${text}</button>`;
  });

  if (content !== updatedContent) {
    fs.writeFileSync(filePath, updatedContent, 'utf8');
    console.log(`Fixed fake links in: ${filePath}`);
  }
}

// List of files that need to be updated
const filesToUpdate = [
  'docs/index.html',
  'docs/code-complexity.html',
  'docs/dependency-graph.html'
  // Add other file paths here if needed
];

const filesWithFakeLinks = [
  // Add file paths here if needed for fake link fixes
];

// Update each file
filesToUpdate.forEach(file => {
  if (fs.existsSync(file)) {
    updateTableHeaders(file);
    addMainLandmark(file);
    console.log(`Updated accessibility for: ${file}`);
  }
});

// Fix fake links in affected files
filesWithFakeLinks.forEach(file => {
  fixFakeLinks(file);
});

module.exports = {
  updateTableHeaders,
  addMainLandmark,
  fixFakeLinks
};