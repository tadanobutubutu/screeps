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
    if (attrs && /\blang\s*=/i.test(attrs)) {
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
          (match, tag, attributes) => {
            const idMatch = /id=["']([^"']*)["']/i.exec(attributes);
            const id = idMatch ? ` id="${idMatch[1]}"` : '';
            // Check if aria-label already exists
            if (/aria-label/i.test(attributes)) {
              return match;
            }
            // Add unique aria-label
            return match.replace('>', ` aria-label="${role}${id}">`);
          }
        );
      }
    });

    // Fix multiple main landmarks by converting extras to divs with role="main" fallback
    const mainMatches = updatedContent.match(/<main[^>]*>/gi);
    if (mainMatches && mainMatches.length > 1) {
      // Keep first main, convert others to divs with role="main"
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

// ... (The remaining functions and code will be the same for both branches)

// ...

// Export functions for testing and external use
module.exports = {
  addLangAttribute,
  addMainLandmark,
  addLangToFiles,
  ensureUniqueLandmarks,
  // ... (The rest of the exports remain the same)
};