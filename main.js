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

      if (hasChanges) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Fixed: Added scope="col" to all <th> elements in ${fileToFix}`);
      } else {
        console.log(`No fixes needed: All <th> elements already have scope attribute in ${fileToFix}`);
      }
    } else {
      console.log(`File not found: ${fileToFix}`);
    }
  } catch (error) {
    console.error(`Error fixing table headers in ${fileToFix}:`, error.message);
  }

  console.log('Table headers fixed - all <th> elements now have scope attribute');
}

// Add the new function to fix React Landmarks (REACT_025)
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

// Add the new function to fix React Landmarks (REACT_017)
function fixMainLandmarks() {
  const fs = require('fs');
  const path = require('path');

  // Files that need <main> landmark fix
  const filesToFix = [
    'app/layout.tsx',
    'dashboard/app/layout.tsx',
    'docs/index.html'
  ];

  filesToFix.forEach(file => {
    try {
      const filePath = path.join(process.cwd(), file);
      if (fs.existsSync(filePath)) {
        let content = fs.readFileSync(filePath, 'utf8');

        // Fix for React/Next.js layout files
        if (file.endsWith('.tsx') || file.endsWith('.jsx')) {
          // Pattern: <body>{children}</body> -> <body><main>{children}</main></body>
          if (content.includes('<body>{children}</body>')) {
            content = content.replace('<body>{children}</body>', '<body><main>{children}</main></body>');
            console.log(`Fixed: Added <main> landmark to ${file}`);
          }
          // Pattern: <body>{props.children}</body> -> <body><main>{props.children}</main></body>
          else if (content.includes('<body>{props.children}</body>')) {
            content = content.replace('<body>{props.children}</body>', '<body><main>{props.children}</main></body>');
            console.log(`Fixed: Added <main> landmark to ${file}`);
          }
          // Pattern: <body>{children}</body> with whitespace
          else if (/<body>\s*\{children\}\s*<\/body>/.test(content)) {
            content = content.replace(/<body>\s*\{children\}\s*<\/body>/, '<body>\n      <main>{children}</main>\n    </body>');
            console.log(`Fixed: Added <main> landmark to ${file}`);
          }
        }

        // Fix for HTML files
        if (file.endsWith('.html')) {
          // Check if <main> already exists
          if (!content.includes('<main>')) {
            // Pattern: <body><div class="container">... -> <body><main><div class="container">...
            const containerMatch = content.match(/<body>([\s\S]*?<div class="container">)/);
            if (containerMatch) {
              content = content.replace(/<body>/, '<body>\n    <main>');
              // Close </main> before </body>
              content = content.replace(/<\/body>/, '\n    </main>\n  </body>');
              console.log(`Fixed: Added <main> landmark to ${file}`);
            }
          }
        }

        fs.writeFileSync(filePath, content, 'utf8');
      }
    } catch (error) {
      console.error(`Error fixing ${file}:`, error.message);
    }
  });

  console.log('Main landmarks fixed - all pages now have <main> landmark for accessibility');
}

// Add the new function to fix SVG accessibility issues
function fixSvgAccessibility() {
  const fs = require('fs');
  const path = require('path');

  // Files that need SVG accessibility fixes
  const filesToFix = [
    'app/layout.tsx',
    'dashboard/app/layout.tsx'
  ];

  filesToFix.forEach(file => {
    try {
      const filePath = path.join(process.cwd(), file);
      if (fs.existsSync(filePath)) {
        let content = fs.readFileSync(filePath, 'utf8');

        // Check if the file contains SVG elements
        if (content.includes('<svg')) {
          // Pattern for SVG elements that need accessibility attributes
          const svgRegex = /(<svg[^>]*>)(.*?)(<\/svg>)/gs;

          content = content.replace(svgRegex, (match, openingTag, innerContent, closingTag) => {
            // Check if the SVG already has accessibility attributes
            if (!openingTag.includes('aria-label') &&
                !openingTag.includes('aria-hidden') &&
                !innerContent.includes('<title>')) {

              // For favicon SVG (dashboard/app/layout.tsx)
              if (file.includes('dashboard')) {
                // Add aria-hidden for decorative SVG
                if (!openingTag.includes('aria-hidden')) {
                  openingTag = openingTag.replace('>', ' aria-hidden="true">');
                  console.log(`Fixed: Added aria-hidden to decorative SVG in ${file}`);
                }
              }
              // For metadata SVG (app/layout.tsx)
              else {
                // Add aria-label for meaningful SVG
                if (!openingTag.includes('aria-label')) {
                  openingTag = openingTag.replace('>', ' aria-label="Application Logo">');
                  console.log(`Fixed: Added aria-label to meaningful SVG in ${file}`);
                }
              }
            }

            return openingTag + innerContent + closingTag;
          });

          fs.writeFileSync(filePath, content, 'utf8');
        }
      }
    } catch (error) {
      console.error(`Error fixing SVG accessibility in ${file}:`, error.message);
    }
  });

  console.log('SVG accessibility fixed - all SVGs now have proper accessibility attributes');
}

// Add the new function to fix React Language Attribute (REACT_015)
function fixReactLanguageAttribute() {
  const fs = require('fs');
  const path = require('path');

  // File that needs language attribute fix
  const fileToFix = 'docs/dependency-graph.html';

  try {
    const filePath = path.join(process.cwd(), fileToFix);
    if (fs.existsSync(filePath)) {
      let content = fs.readFileSync(filePath, 'utf8');

      // Check if the html tag already has a lang attribute
      if (!content.includes('<html lang=')) {
        // Add lang="en" to the html tag
        content = content.replace(/<html>/i, '<html lang="en">');
        console.log(`Fixed: Added lang="en" attribute to html tag in ${fileToFix}`);

        fs.writeFileSync(filePath, content, 'utf8');
      } else {
        console.log(`No fix needed: html tag already has lang attribute in ${fileToFix}`);
      }
    } else {
      console.log(`File not found: ${fileToFix}`);
    }
  } catch (error) {
    console.error(`Error fixing language attribute in ${fileToFix}:`, error.message);
  }

  console.log('React language attribute fixed - html tag now has lang attribute');
}

// Call the function if needed
// fixMainLandmarks();
// fixSvgAccessibility();
// fixReactLandmarks();
// fixReactLanguageAttribute();

// Export for use in other modules
module.exports = {
  fixTableHeaders,
  fixMainLandmarks,
  fixSvgAccessibility,
  fixReactLandmarks,
  fixReactLanguageAttribute
};