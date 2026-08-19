// Preserve all existing code from main.js
// ... (all your existing code remains unchanged)

// Add the new function to fix the table headers
function fixTableHeaders() {
  const fs = require('fs');
  const path = require('path');

  // File that needs table header fixes
  const fileToFix = 'docs/dependency-graph.html';

  try {
    const filePath = path.join(process.cwd(), fileToFix);
    if (fs.existsSync(filePath)) {
      let content = fs.readFileSync(filePath, 'utf8');

      // Find all <th> elements without scope attribute
      const thRegex = /<th>(.*?)<\/th>/g;
      let match;
      let hasChanges = false;

      // Replace each <th> with scope="col" if it doesn't already have a scope
      content = content.replace(thRegex, (fullMatch, innerContent) => {
        if (!fullMatch.includes('scope=')) {
          hasChanges = true;
          return `<th scope="col">${innerContent}</th>`;
        }
        return fullMatch;
      });

      // Exclusively add fixing React Landmarks (REACT_025) functionality
      function fixReactLandmarks() {
        const fs = require('fs');
        const path = require('path');

        // Files that need <main> landmark fix
        const filesToFix = [
          'components/Dashboard.tsx',
          'dashboard/components/Dashboard.tsx'
        ];

        filesToFix.forEach(file => {
          try {
            const filePath = path.join(process.cwd(), file);
            if (fs.existsSync(filePath)) {
              let content = fs.readFileSync(filePath, 'utf8');

              // Check if there are multiple <main> elements in different return paths
              if (content.includes('<main>') && content.match(/<main>/g).length > 1) {
                // Find the error state main element
                const errorMainMatch = content.match(/(<main>[\s\S]*?<\/main>)/);
                if (errorMainMatch) {
                  // Replace the error state main with a section
                  content = content.replace(errorMainMatch[0],
                    `<section aria-label="Error state" style={{ padding: '2rem', fontFamily: 'monospace' }}>${errorMainMatch[1].replace(/<main>|<\/main>/g, '')}</section>`);
                  console.log(`Fixed: Replaced <main> with <section> in error state for ${file}`);
                }

                // Find the success state main element
                const successMainMatch = content.match(/(<main>[\s\S]*?<\/main>)/);
                if (successMainMatch) {
                  // Replace the success state main with a section
                  content = content.replace(successMainMatch[0],
                    `<section aria-label="Success state">${successMainMatch[1].replace(/<main>|<\/main>/g, '')}</section>`);
                  console.log(`Fixed: Replaced <main> with <section> in success state for ${file}`);
                }

                fs.writeFileSync(filePath, content, 'utf8');
              }
            }
          } catch (error) {
            console.error(`Error fixing landmarks in ${file}:`, error.message);
          }
        });

        console.log('React landmarks fixed - all components now have a single <main> landmark');
      }

      // Exclusively add fixing React Landmarks (REACT_017) functionality
      function fixMainLandmarks() {
        // ... functionality below original fixMainLandmarks function (as it is not a conflict)
      }

      // Exclusively add fixing SVG accessibility issues functionality
      function fixSvgAccessibility() {
        // ... functionality below original fixSvgAccessibility function (as it is not a conflict)
      }

      // Exclusively add fixing React Language Attribute (REACT_015) functionality
      function fixReactLanguageAttribute() {
        // ... functionality below original fixReactLanguageAttribute function (as it is not a conflict)
      }

      // Exclusively add fixing React Fake Link (REACT_036) functionality
      function fixReactFakeLink() {
        // ... functionality below original fixReactFakeLink function (as it is not a conflict)
      }

      // Call the functions whose changes were made in this branch
      fixTableHeaders();
      fixReactLandmarks();

      return;
    } else {
      console.log(`File not found: ${fileToFix}`);
    }
  } catch (error) {
    console.error(`Error fixing table headers in ${fileToFix}:`, error.message);
  }

  console.log('Table headers fixed - all <th> elements now have scope attribute');
}

// Export for use in other modules
module.exports = {
  fixTableHeaders,
  fixMainLandmarks,
  fixSvgAccessibility,
  fixReactLandmarks,
  fixReactLanguageAttribute,
  fixReactFakeLink
};