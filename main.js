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
    /<html([^>]*)>/gi,
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
 */
async function addMainLandmark() {
  // ... (same as before)
}

/**
 * Adds a function to modify the HTML content with the `lang` attribute.
 * This can be used to handle more complex scenarios, such as multiple languages in one file.
 */
async function addLangToFiles() {
  // ... (same as before)
}

/**
 * Replaces hash links with buttons for better accessibility
 */
async function replaceHashLinksWithButtons() {
  // ... (same as before)
}

/**
 * Fixes table structure issues by ensuring tables have proper structure
 * with required elements like <thead>, <tbody>, and proper headers
 */
async function fixTableStructure() {
  // ... (same as before)
}

/**
 * Ensures unique landmarks in the HTML content
 * Addresses REACT_025: Ensure unique landmarks
 */
async function ensureUniqueLandmarks() {
  // ... (same as before)
}

/**
 * Adds accessible names to SVG files for better screen reader support
 */
async function addSvgAccessibleNames() {
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

    if (!/aria-label/i.test(fileContent) && !/role="img"/i.test(fileContent)) {
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
}

const mainElement = 'main';

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

module.exports = {
  addLangAttribute,
  addMainLandmark,
  addLangToFiles,
  replaceHashLinksWithButtons,
  fixTableStructure,
  ensureUniqueLandmarks,
  addSvgAccessibleNames,
  addressAccessibilityIssues,
};

exports.addLangAttribute = addLangAttribute;
exports.addMainLandmark = addMainLandmark;
exports.addLangToFiles = addLangToFiles;
exports.replaceHashLinksWithButtons = replaceHashLinksWithButtons;
exports.fixTableStructure = fixTableStructure;
exports.ensureUniqueLandmarks = ensureUniqueLandmarks;
exports.addSvgAccessibleNames = addSvgAccessibleNames;
exports.addressAccessibilityIssues = addressAccessibilityIssues;

if (require.main === module) {
  addressAccessibilityIssues();
}