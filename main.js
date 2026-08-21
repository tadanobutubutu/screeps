const fs = require('fs').promises;
const path = require('path');

/**
 * Adds `lang="en"` to the root `<html>` element if it is missing.
 * Preserves any existing attributes and avoids duplicating a `lang` attribute.
 * @param {string} content - HTML string to modify
 * @returns {string} - Modified HTML with a language attribute
 */
function addLangAttribute(content) {
  return content.replace(/<html([^>]*)>/i, (match, attrs) => {
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
        /<body([^>]*)>([\s\S]*)<\/body>/i,
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
      /<a([^>]*href=["']#[^"']*["'][^>]*)>(.*?)<\/a>/gi,
      (match, attrsBefore, id, attrsAfter, text) => {
        const idAttr = id ? ` id="${id}"` : '';
        const allAttrs = (attrsBefore || '') + (attrsAfter || '');
        const classMatch = /class=["']([^"']*)["']/i.exec(allAttrs);
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
              return `<thead><tr${rowAttrs}>${headerCells}</tr></thead><tbody>`;
            }
          );
          
          // Wrap remaining content in tbody if not already present
          if (!/<tbody>/i.test(fixedContent)) {
            const afterHeader = fixedContent.replace('</thead>', '</thead><tbody>');
            fixedContent = afterHeader.replace(/(<\/thead><tbody>)([\s\S]*)$/i, '$1$2</tbody>');
          }
          
          return `<table${tableAttrs}>${fixedContent}</table>`;
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
      const rolePattern = new RegExp(`<[^>]*role=["']${role}["'][^>]*/`, 'gi');
      const landmarks = fileContent.match(rolePattern);
      if (landmarks && landmarks.length > 1) {
        // Add aria-label to make duplicate landmarks unique
        updatedContent = updatedContent.replace(
          new RegExp(`<([^>]*role=["']${role}["'][^>]*)>`, 'gi'),
          (match, tag, attrsBefore, attrsAfter) => {
            const allAttrs = (attrsBefore || '') + (attrsAfter || '');
            // Check if aria-label already exists
            if (/aria-label/i.test(allAttrs)) {
              return match;
            }
            // Add unique aria-label
            return match.replace('>', ` aria-label="${role}">`);
          }
        );
      }
    });
    
    // Fix multiple main landmarks by converting extras to divs
    const mainMatches = updatedContent.match(/<main[^>]*>/gi);
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
      const hasRoleImg = /role=["']img["']/i.test(fileContent);
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
 * Function to add accessible name to SVGs for accessibility
 * @param {string} svgData - SVG content as string
 * @param {string} label - Accessible label to add
 * @returns {string} - Modified SVG with accessible name
 */
function addAccessibleSvg(svgData, label) {
  // Regex to find the SVG tag and the content within it
  const svgRegex = /<svg[\s\S]*?<\/svg>/i;
  const titleRegex = /<title[^>]*>(.*?)<\/title>/i;
  const textRegex = /<text[^>]*>(.*?)<\/text>/i;

  // Replace the SVG content with an updated version that includes a title element
  return svgData.replace(svgRegex, (match) => {
    // Check if the SVG already contains a title
    let hasTitle = titleRegex.test(match);
    let hasText = textRegex.test(match);

    // Add a title element if it doesn't already exist and if the SVG contains text
    if (!hasTitle && hasText) {
      // Replace the SVG content with a title element wrapping the existing text
      return match.replace(textRegex, (textMatch) => {
        return `<title>${label}</title>${textMatch}`;
      });
    }

    // If the SVG doesn't contain text or already has a title, return the original match
    return match;
  });
}

/**
 * Function to update icons with accessible name
 * @param {Object} icons - Object containing icon SVG data
 * @param {string} label - Accessible label to add
 * @returns {Object} - Updated icons object with accessible SVGs
 */
function updateIcons(icons, label) {
  const updatedIcons = {};
  for (const key in icons) {
    const svgData = icons[key];
    const accessibleSvg = addAccessibleSvg(svgData, label);
    updatedIcons[key] = accessibleSvg;
  }
  return updatedIcons;
}

/**
 * Function to update the 'rotate back' link with a button for accessibility
 * Note: This function is designed for client-side use in browsers
 */
function updateRotateBackLink() {
  // Check if we're in a browser environment
  if (typeof document === 'undefined') return;
  
  const rotateBackLink = document.querySelector('.rotate-back a, a.rotate-back');
  if (rotateBackLink) {
    // Replace the anchor with a button
    const button = document.createElement('button');
    button.textContent = 'rotate back';
    button.type = 'button'; // Specify the button type to avoid form submission
    button.className = rotateBackLink.className;
    rotateBackLink.parentNode.replaceChild(button, rotateBackLink);
  }
}

/**
 * Function to add main landmark for accessibility (client-side version)
 * Note: This function is designed for client-side use in browsers
 * Addresses REACT_017
 */
function addMainLandmarkClient() {
  // Check if we're in a browser environment
  if (typeof document === 'undefined') return;
  
  // Check if main element already exists
  const existingMain = document.querySelector('main');
  if (existingMain) {
    return; // Already has a main landmark
  }

  // Find the primary content area
  const tableRotated = document.getElementById('table-rotated');
  const container = document.querySelector('.container');
  const primaryContent = tableRotated || container;

  // Wrap the primary content in a main element
  if (primaryContent && primaryContent.parentNode) {
    const main = document.createElement('main');
    primaryContent.parentNode.insertBefore(main, primaryContent);
    main.appendChild(primaryContent);
  }
}

/**
 * Function to add a new feature
 */
function myFunction() {
  console.log("This is my new function!");
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
  addAccessibleSvg,
  updateIcons,
  updateRotateBackLink,
  addMainLandmarkClient,
  myFunction,
  addressAccessibilityIssues
};

// Additional named exports for test compatibility
exports.addLangAttribute = addLangAttribute;
exports.addMainLandmark = addMainLandmark;
exports.addLangToFiles = addLangToFiles;
exports.replaceHashLinksWithButtons = replaceHashLinksWithButtons;
exports.fixTableStructure = fixTableStructure;
exports.ensureUniqueLandmarks = ensureUniqueLandmarks;
exports.addSvgAccessibleNames = addSvgAccessibleNames;
exports.addAccessibleSvg = addAccessibleSvg;
exports.updateIcons = updateIcons;
exports.updateRotateBackLink = updateRotateBackLink;
exports.addMainLandmarkClient = addMainLandmarkClient;
exports.myFunction = myFunction;
// Exported for completeness, though primarily internal
exports.addressAccessibilityIssues = addressAccessibilityIssues;

// Run accessibility fixes if this script is executed directly
if (require.main === module) {
  addressAccessibilityIssues();
}

// Client-side initialization for browser environment
if (typeof window !== 'undefined') {
  window.onload = function() {
    updateRotateBackLink();
    addMainLandmarkClient();
  };
}