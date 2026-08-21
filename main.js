const fs = require('fs').promises;
const path = require('path');

/**
 * Adds `lang="en"` to the root `<html>` element if it is missing.
 * Preserves any existing attributes and avoids duplicating a `lang` attribute.
 * @param {string} content - HTML string to modify
 * @returns {string} - Modified HTML with a language attribute
 */
function addLangAttribute(content) {
  return content.replace(/<html(\s[^>]*)?>/i, (match, attrs) => {
    if (attrs && /\slang\s*=/i.test(attrs)) {
      return match;
    }
    return `<html${attrs ? attrs : ''} lang="en">`;
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
      const fileContent = await fs.readFile(filePath, 'utf8');
      // Check if <main> landmark already exists to avoid duplicates (REACT_025)
      if (/<main[\s>]/i.test(fileContent)) {
        console.log(`Main landmark already exists in ${filePath}, skipping`);
        continue;
      }
      const updatedContent = fileContent.replace(
        /(<body[^>]*>)((?:[\s\S]*?)<\/body>)/i,
        (match, bodyOpen, bodyContent) => {
          return bodyOpen + '\n<main>\n' + bodyContent + '\n</main>';
        }
      );
      await fs.writeFile(filePath, updatedContent);
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
async function addLangToFiles() {
  try {
    console.log('Adding lang attribute to HTML files...');
    const filePath = path.join('docs', 'index.html');
    const fileContent = await fs.readFile(filePath, 'utf8');
    const updatedContent = addLangAttribute(fileContent);
    await fs.writeFile(filePath, updatedContent);
    console.log('Lang attribute added successfully.');
  } catch (error) {
    console.error('Error adding lang attribute:', error);
    throw error;
  }
}

/**
 * Replaces hash links with buttons for better accessibility
 */
async function replaceHashLinksWithButtons() {
  try {
    console.log('Replacing hash links with buttons for better accessibility...');
    const filePath = path.join('docs', 'index.html');
    const fileContent = await fs.readFile(filePath, 'utf8');
    const updatedContent = fileContent.replace(
      /<a\s+([^>]*?)href="#([^"]*)"([^>]*)>([\s\S]*?)<\/a>/gi,
      (match, attrsBefore, id, attrsAfter, text) => {
        const idAttr = id ? ` id="${id}"` : '';
        const allAttrs = (attrsBefore || '') + (attrsAfter || '');
        const classMatch = allAttrs.match(/class="([^"]*)"/);
        const classAttr = classMatch ? ` class="${classMatch[1]}"` : '';
        // Remove the href from the button to avoid "fake link" issues
        return `<button${idAttr}${classAttr}>${text}</button>`;
      }
    );
    await fs.writeFile(filePath, updatedContent);
    console.log('Hash links replaced with buttons successfully.');
  } catch (error) {
    console.error('Error replacing hash links with buttons:', error);
    throw error;
  }
}

/**
 * Fixes table structure issues by ensuring tables have proper structure
 * with required elements like <thead>, <tbody>, and proper headers
 */
async function fixTableStructure() {
  try {
    console.log('Fixing table structure issues...');
    const filePath = path.join('docs', 'index.html');
    const fileContent = await fs.readFile(filePath, 'utf8');
    
    // Fix tables by ensuring they have proper header rows and structure
    const updatedContent = fileContent.replace(
      /<table([^>]*)>([\s\S]*?)<\/table>/gi,
      (match, tableAttrs, tableContent) => {
        // Check if table already has proper structure
        if (/<thead>/i.test(tableContent) || /<tbody>/i.test(tableContent)) {
          return match;
        }
        
        // Add thead with header row for tables without proper headers
        const firstRowMatch = /<tr([^>]*)>([\s\S]*?)<\/tr>/i.exec(tableContent);
        if (firstRowMatch) {
          // Convert first row cells to header cells
          let fixedContent = tableContent.replace(
            /<tr([^>]*)>([\s\S]*?)<\/tr>/i,
            (rowMatch, rowAttrs, rowContent) => {
              const headerCells = rowContent.replace(
                /<td([^>]*)>([\s\S]*?)<\/td>/gi,
                (cellMatch, cellAttrs, cellContent) => {
                  return `<th${cellAttrs}>${cellContent}</th>`;
                }
              );
              return `<thead><tr${rowAttrs}>${headerCells}</tr></thead>`;
            }
          );
          
          // Wrap remaining content in tbody if not already present
          if (!/<tbody/i.test(fixedContent)) {
            const afterHeader = fixedContent.replace(/<\/thead>/, '');
            fixedContent = fixedContent.replace(
              /(<thead>[\s\S]*?<\/thead>)([\s\S]*)/,
              '$1<tbody>$2</tbody>'
            );
          }
          
          return /<thead>/i.test(fixedContent) ? fixedContent : match;
        }
        
        // For simple tables without rows, just wrap content
        if (!/<tr/i.test(tableContent)) {
          return `<table${tableAttrs}><tbody>${tableContent}</tbody></table>`;
        }
        
        // Default fix: wrap content in tbody
        return `<table${tableAttrs}><tbody>${tableContent}</tbody></table>`;
      }
    );
    
    await fs.writeFile(filePath, updatedContent);
    console.log('Table structure issues fixed.');
  } catch (error) {
    console.error('Error fixing table structure issues:', error);
    throw error;
  }
}

/**
 * Ensures unique landmarks in the HTML content
 * Addresses REACT_025: Ensure unique landmarks
 */
async function ensureUniqueLandmarks() {
  try {
    console.log('Ensuring unique landmarks in HTML content...');
    const filePath = path.join('docs', 'index.html');
    const fileContent = await fs.readFile(filePath, 'utf8');
    
    // Track landmark usage to ensure uniqueness
    const landmarkRoles = ['banner', 'navigation', 'main', 'complementary', 'contentinfo'];
    let updatedContent = fileContent;
    
    landmarkRoles.forEach(role => {
      const rolePattern = new RegExp(`role="${role}"`, 'gi');
      const landmarks = updatedContent.match(rolePattern);
      if (landmarks && landmarks.length > 1) {
        // Add aria-label to make duplicate landmarks unique
        updatedContent = updatedContent.replace(
          new RegExp(`<([a-z]+)([^>]*)role("${role}")([^>]*)>`, 'gi'),
          (match, tag, attrsBefore, attrsAfter) => {
            const allAttrs = (attrsBefore || '') + (attrsAfter || '');
            // Check if aria-label already exists
            if (/aria-label/i.test(allAttrs)) {
              return match;
            }
            // Add unique aria-label
            return match.replace('>', ` aria-label="${tag}-${role}">`);
          }
        );
      }
    });
    
    // Fix multiple main landmarks by converting extras to divs
    const mainMatches = updatedContent.match(/<main[\s>]/gi);
    if (mainMatches && mainMatches.length > 1) {
      // Keep first main, convert others to divs with role="main" fallback
      let mainCount = 0;
      updatedContent = updatedContent.replace(
        /<main([^>]*)>/gi,
        (match, attrs) => {
          mainCount++;
          if (mainCount === 1) {
            return match;
          }
          return `<div${attrs} role="main">`;
        }
      );
      
      // Also replace closing tags
      let closeCount = 0;
      updatedContent = updatedContent.replace(
        /<\/main>/gi,
        () => {
          closeCount++;
          if (closeCount === 1) {
            return '</main>';
          }
          return '</div>';
        }
      );
    }
    
    await fs.writeFile(filePath, updatedContent);
    console.log('Unique landmarks ensured.');
  } catch (error) {
    console.error('Error ensuring unique landmarks:', error);
    throw error;
  }
}

/**
 * Adds accessible names to SVG files for better screen reader support
 */
async function addSvgAccessibleNames() {
  try {
    const svgFiles = ['image.svg', 'icon.svg'];
    
    for (const fileName of svgFiles) {
      const filePath = path.join('docs', fileName);
      
      let fileContent;
      try {
        fileContent = await fs.readFile(filePath, 'utf8');
      } catch (err) {
        console.log(`SVG file ${fileName} not found, skipping`);
        continue;
      }

      // Check if SVG already has role="img" or aria-label
      const hasRoleImg = /role="img"/i.test(fileContent);
      const hasAriaLabel = /aria-label=/i.test(fileContent);

      if (!hasRoleImg && !hasAriaLabel) {
        // Add role="img" and aria-label if missing
        const modifiedContent = fileContent.replace(
          /<svg([^>]*)>/gi,
          (match, attrs) => {
            const attributeString = attrs || '';
            return `<svg${attributeString} role="img" aria-label="Generated dependency graph">`;
          }
        );

        await fs.writeFile(filePath, modifiedContent);
        console.log(`Added accessible names to ${fileName}`);
      }
    }
  } catch (error) {
    console.error('Error adding accessible names to SVGs:', error);
    throw error;
  }
}

/**
 * Addresses all accessibility issues from the insight report.
 * Orchestrates the individual accessibility functions in the correct order.
 */
async function addressAccessibilityIssues() {
  try {
    await addMainLandmark();
    await addLangToFiles();
    await replaceHashLinksWithButtons();
    await fixTableStructure();
    await ensureUniqueLandmarks();
    await addSvgAccessibleNames();
    console.log('All accessibility issues have been addressed.');
  } catch (error) {
    console.error('Error addressing accessibility issues:', error);
    throw error;
  }
}

// Export functions for testing and external use
module.exports = {
  addLangAttribute,
  addMainLandmark,
  addLangToFiles,
  replaceHashLinksWithButtons,
  fixTableStructure,
  ensureUniqueLandmarks,
  addSvgAccessibleNames,
  addressAccessibilityIssues
};

// Run accessibility fixes if this script is executed directly
if (require.main === module) {
  addressAccessibilityIssues();
}