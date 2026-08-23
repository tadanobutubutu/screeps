const express = require('express');
const app = express();

function fixDependencyDashboard() {
  const fs = require('fs');
  const path = require('path');
  const workflowPath = path.join(__dirname, '.github', 'workflows', 'gitstream.yml');
  if (fs.existsSync(workflowPath)) {
    let content = fs.readFileSync(workflowPath, 'utf8');
    content = content.replace(
      /linear-bots\/gitstream-github-action\s+v2/g,
      'linear-bots/gitstream-github-action@v2'
    );
    fs.writeFileSync(workflowPath, content, 'utf8');
  }
}

// TODO: This is the existing code that needs to be preserved
// ----- BEGIN ORIGINAL CODE (unchanged) -----
// [PLACE ALL EXISTING FUNCTIONS, VARIABLES, AND EXPORTS HERE]
// Example:
// const someVar = require('some-module');
// function init() { /* ... */ }
// module.exports.loop = function() { /* ... */ }
// ----- END ORIGINAL CODE-----

// Create a function to generate the html string with the lang attribute
function generateHtmlWithLang() {
  const html = `
<html lang="en">
<!-- ... Your existing html content ... -->
</html>
  `;

  return html;
}

// Modify the build script to use the new function
const html = generateHtmlWithLang();
// ... other operations to write the html to the docs/dependency-graph.html file ...

// Define function to set up accessible SVG icons
function setupSVGIcons() { // Define a function to create an accessible SVG element
    function createAccessibleSVG(iconData, label) {
        return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
            <title>${label}</title>
            ${iconData}
        </svg>`;
    }

    // Replace the SVG creation with the accessible version
    const icons = {
        icon: createAccessibleSVG(
            'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y="0.9em" font-size="90">🐛</text></svg>',
            'Screeps Dashboard Icon'
        ),
        apple: createAccessibleSVG(
            'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y="0.9em" font-size="90">🐛</text></svg>',
            'Apple Icon'
        )
        // ... other icons ...
    };

    // ... other code ...

    // Call the function to set up the icons
    setupSVGIcons(); // ... existing code ...
}

// Call the function once
setupSVGIcons();

// Export the app and the fix function
module.exports = app;
module.exports.fixDependencyDashboard = fixDependencyDashboard;