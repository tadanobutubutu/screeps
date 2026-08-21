const fs = require('fs').promises;
const path = require('path');

/**
 * Adds `lang="en"` to the root `<html>` element if it is missing.
 * Preserves any existing attributes and avoids duplicating a `lang` attribute.
 * @param {string} content - HTML string to modify
 * @returns {string} - Modified HTML with a language attribute
 */
function addLangAttribute(content) {
  return content.replace(
    /<html(\s+[^>]*)?>/gi,
    (match, attrs) => {
      if (attrs && /\blang\s*=/i.test(attrs)) {
        return match;
      }
      return `<html${attrs ? attrs : ''} lang="en">`;
    }
  );
}

/**
 * Adds a <main> landmark to the HTML content for accessibility
 * Adds a function to modify the HTML content with the `lang` attribute
 * This can be used to handle more complex scenarios, such as multiple languages in one file.
 */
async function addFunctions() {
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

  // ... existing addMainLandmark function

  module.exports = {
    addLangAttribute,
    addMainLandmark,
    addLangToFiles,
  };

  exports.addLangAttribute = addLangAttribute;
  exports.addMainLandmark = addMainLandmark;
  exports.addLangToFiles = addLangToFiles;
}

/**
 * Adds a function to replace hash links with buttons for better accessibility
 * Addresses all accessibility issues from the insight report.
 * Orchestrates the individual accessibility functions in the correct order.
 */
async function addressAccessibilityIssues() {
  try {
    await addMainLandmark();
    await addFunctions(); // Contextualize addLangToFiles within addressAccessibilityIssues
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

if (require.main === module) {
  addressAccessibilityIssues();
}