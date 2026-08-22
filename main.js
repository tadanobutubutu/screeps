const fs = require('fs');
const path = require('path');

/**
 * Main entry point for dependency management and configuration
 * Handles updates for: jest, typescript, react, eslint, and other dependencies
 */

 // Version compatibility matrix for the updates mentioned in the dashboard
 const DEPENDENCY_UPDATES = {
   jest: {
     current: '^29.6.1',
     next: '^30.0.0',
     packages: ['jest', 'babel-jest']
   },
   typescript: {
     current: '^5.7.3',
     next: '^7.0.0'
   },
   react: {
     current: '^18.2.0',
     next: '^19.0.0',
     packages: ['react', 'react-dom']
   },
   eslint: {
     current: '^8.47.0',
     next: '^10.0.0'
   }
 };

 // Check compatibility between dependencies
 function checkCompatibility(dep1, dep1Version, dep2, dep2Version) {
   const compatibilityMatrix = {
     'jest+typescript': { min: '5.0', max: '7.0' },
     'jest+react': { min: '18.0', max: '19.0' },
     'eslint+typescript': { min: '5.0', max: '7.0' }
   };
   
   const key = `${dep1}+${dep2}`;
   const range = compatibilityMatrix[key];
   
   if (!range) return { compatible: true };
   
   const majorVersion = (version) => {
     const match = version.match(/\^?(\d+)/);
     return match ? parseInt(match[1]) : null;
   };
   
   const version = majorVersion(dep2Version);
   
   if (version < parseInt(range.min) || version > parseInt(range.max)) {
     return {
       compatible: false,
       reason: `${dep1} may have compatibility issues with ${dep2} ${dep2Version}`
     };
   }
   
   return { compatible: true };
 }

// Validate all detected dependencies from Renovate dashboard
 function validateDependencies(dependencies) {
   const errors = [];
   const warnings = [];
   
   if (dependencies.jest && dependencies.typescript) {
     const result = checkCompatibility(
       'jest', dependencies.jest,
       'typescript', dependencies.typescript
     );
     if (!result.compatible) {
       errors.push(result.reason);
     }
   }
   
   if (dependencies.eslint && dependencies.typescript) {
     const result = checkCompatibility(
       'eslint', dependencies.eslint,
       'typescript', dependencies.typescript
     );
     if (!result.compatible) {
       errors.push(result.reason);
     }
   }
   
   return { errors, warnings };
 }

// Get recommended update order based on dependency tree
 function getRecommendedUpdateOrder() {
   return [
     'typescript',  // Update TypeScript first as other tools depend on types
     'eslint',      // Update ESLint to v10
     'jest',        // Update Jest to v30 (includes babel-jest)
     'react'        // Update React to v19 last
   ];
 }

// Check for breaking changes in major version updates
 function hasBreakingChanges(currentVersion, newVersion) {
   const currentMajor = currentVersion.match(/\^?(\d+)/)?.[1] || '0';
   const newMajor = newVersion.match(/\^?(\d+)/)?.[1] || '0';
   
   if (newMajor > currentMajor) {
     return {
       hasBreaking: true,
       majorBump: newMajor - currentMajor,
       note: `Major version update from ${currentMajor} to ${newMajor}`
     };
   }
   
   return { hasBreaking: false };
 }

// Main function to process dependency updates
 function processDependencyUpdates() {
   const updateOrder = getRecommendedUpdateOrder();
   const results = [];
   
   updateOrder.forEach(dep => {
     const update = DEPENDENCY_UPDATES[dep];
     if (update) {
       results.push({
         dependency: dep,
         from: update.current,
         to: update.next,
         packages: update.packages || [dep],
         breaking: hasBreakingChanges(update.current, update.next)
       });
     }
   });
   
   return results;
 }

/**
 * Adds `lang="en"` to the root `<html>` element if it is missing.
 * Preserves any existing attributes and avoids duplicating a `lang` attribute.
 * @param {string} content - HTML string to modify
 * @returns {string} - Modified HTML with a language attribute
 */
function addLangAttribute(content) {
  return content.replace(/<html(\s+[^>]*)?>/gi, (match, attrs) => {
    if (attrs && /\blang\s*=/i.test(attrs)) {
      return match;
    }
    return attrs ? `<html${attrs} lang="en">` : '<html lang="en">';
  });
}

/**
 * Adds a <main> landmark to the HTML content for accessibility
 */
async function addMainLandmark() {
    try {
        console.log('Adding <main> landmark to HTML content for accessibility...');
        const filesToUpdate = [path.join('docs', 'index.html')];
        for (const filePath of filesToUpdate) {
            const fileContent = fs.readFileSync(filePath, 'utf8');
            const updatedContent = fileContent.replace(/<\/main>/gi, '');
            const newFileContent = updatedContent.replace(/(<body[^>]*>)([\s\S]*)(<\/html>)/gi, (match, bodyOpen, bodyContent, bodyClose) => {
                return bodyOpen + '\n<main>\n' + bodyContent + '\n</main>' + bodyClose;
            });
            fs.writeFileSync(filePath, newFileContent);
            console.log(`Main landmark added to ${filePath}`);
        }
        console.log('All HTML files have been updated with <main> landmarks.');
    } catch (error) {
        console.error('Error adding <main> landmark:', error);
        throw error;
    }
}

/**
 * Adds a function to modify the HTML content with the `lang` attribute.
 * This can be used to handle more complex scenarios, such as multiple languages in one file.
 */
async function modifyHtmlWithLangAttribute(content) {
    // Implementation would go here
}

/**
 * Replaces hash links with buttons for better accessibility
 */
async function replaceHashLinksWithButtons() {
    try {
        console.log('Replacing hash links with buttons for better accessibility...');
        const filePath = path.join('docs', 'index.html');
        const fileContent = fs.readFileSync(filePath, 'utf8');
        const updatedContent = fileContent.replace(/<a(\s+[^>]*)?href\s*=\s*["']#([^"']*)["'](\s+[^>]*)?>([^<]*)<\/a>/gi, (match, attrsBefore, id, attrsAfter, text) => {
            const idMatch = id;
            const idAttr = idMatch ? ` id="${idMatch}"` : '';
            const allAttrs = (attrsBefore || '') + (attrsAfter || '');
            const classMatch = allAttrs.match(/class\s*=\s*["']([^"']*)["']/i);
            const classAttr = classMatch ? ` class="${classMatch[1]}"` : '';
            // Remove the href from the button to avoid "fake link" issues
            return `<button${idAttr}${classAttr} type="button">${text}</button>`;
        });
        fs.writeFileSync(filePath, updatedContent);
        console.log('Hash links replaced with buttons successfully.');
    } catch (error) {
        console.error('Error replacing hash links with buttons:', error);
        throw error;
    }
}

/**
 * Adds accessible names to SVG files for better screen reader support
 */
async function addAccessibleNamesToSvgFiles() {
    try {
        const svgFiles = fs.readdirSync('docs').filter(file =>
            file.endsWith('.svg')
        );

        for (const fileName of svgFiles) {
            const filePath = path.join('docs', fileName);
            const fileContent = fs.readFileSync(filePath, 'utf8');

            // Check if SVG already has role="img" or aria-label
            const hasRoleImg = fileContent.includes('role="img"');
            const hasAriaLabel = fileContent.includes('aria-label');

            if (!hasRoleImg && !hasAriaLabel) {
                // Add role="img" and aria-label if missing
                const modifiedContent = fileContent.replace(
                    /<svg([^>]*)>/gi,
                    (match, attrs) => {
                        const newAttrs = [...(attrs || []), 'role="img"'];
                        return `${match}[${newAttrs.join(' ')}]`;
                    }
                );

                fs.writeFileSync(filePath, modifiedContent);
                console.log(`Added accessible names to ${fileName}`);
            }
        }
    } catch (error) {
        console.error('Error adding accessible names to SVGs:', error);
        throw error;
    }
}

// Export all utilities
module.exports = {
  DEPENDENCY_UPDATES,
  checkCompatibility,
  validateDependencies,
  getRecommendedUpdateOrder,
  hasBreakingChanges,
  processDependencyUpdates,
  addLangAttribute,
  addMainLandmark,
  modifyHtmlWithLangAttribute,
  replaceHashLinksWithButtons,
  addAccessibleNamesToSvgFiles
};

// Run if executed directly
if (require.main === module) {
  console.log('Processing dependency updates...\n');
  const updates = processDependencyUpdates();
  
  updates.forEach(update => {
    console.log(`[${update.dependency.toUpperCase()}]`);
    console.log(`  ${update.from} → ${update.to}`);
    if (update.breaking.hasBreaking) {
      console.log(`  WARNING: ${update.breaking.note}`);
    }
    console.log();
  });
}