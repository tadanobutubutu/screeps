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
 */
async function addMainLandmark() {
  try {
    console.log('Adding <main> landmark to HTML content for accessibility...');
    const filesToUpdate = [path.join('docs', 'index.html')];
    for (const filePath of filesToUpdate) {
      const fileContent = await fs.readFile(filePath, 'utf8');
      if (/<main[^>]*>/i.test(fileContent)) {
        console.log(`Main landmark already exists in ${filePath}, skipping`);
        continue;
      }
      const updatedContent = fileContent.replace(
        /(<body[^>]*>)(\s*)([\s\S]*?)(<\/body>)/gi,
        (match, bodyOpen, whitespace, bodyContent, bodyClose) => {
          return `${bodyOpen}${whitespace}<main>${bodyContent}</main>${bodyClose}`;
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
      /<a\s+href="#([^"]*)"([^>]*)>([^<]*)<\/a>/gi,
      (match, attrsBefore, id, attrsAfter, text) => {
        const idAttr = id ? ` id="${id}"` : '';
        const classMatch = /class="([^"]*)"/gi.exec(attrsAfter);
        const classAttr = classMatch ? ` class="${classMatch[1]}"` : '';
        return `<button${idAttr}${classAttr} type="button">${text}</button>`;
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
    const updatedContent = fileContent.replace(
      /<table([^>]*)>(\s*)([\s\S]*?)(<\/table>)/gi,
      (match, tableAttrs, whitespace, tableContent) => {
        if (/<thead>[\s\S]*<\/thead>/i.test(tableContent) || /<tbody>[\s\S]*<\/tbody>/i.test(tableContent)) {
          return match;
        }
        const firstRowMatch = /<tr[^>]*>([\s\S]*?)<\/tr>/i.exec(tableContent);
        if (firstRowMatch) {
          const headerCells = firstRowMatch[1].replace(
            /<t[dh]([^>]*)>([\s\S]*?)<\/t[dh]>/gi,
            (cellMatch, cellAttrs, cellContent) =>
              `<th${cellAttrs}>${cellContent}</th>`
          );
          const restContent = tableContent.replace(firstRowMatch[0], '');
          return `<table${tableAttrs}><thead><tr>${headerCells}</tr></thead><tbody>${restContent}</tbody></table>`;
        }
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
    let updatedContent = fileContent;
    ['banner', 'navigation', 'main', 'complementary', 'contentinfo'].forEach(role => {
      const rolePattern = new RegExp(`<[^>]*\\b(role=['"]${role}['"]|${role})\\b[^>]*>`, 'gi');
      let match;
      while ((match = rolePattern.exec(updatedContent)) !== null) {
        updatedContent = updatedContent.replace(
          rolePattern,
          (fullMatch) => {
            const attrs = fullMatch.match(/[\w-]+=(['"])[^\1]*?\1/gi) || [];
            const existingAriaLabel = attrs.find(a => /aria-label/i.test(a));
            if (existingAriaLabel) return fullMatch;
            return fullMatch.replace(/>$/, ` aria-label="${role}">`);
          }
        );
      }
    });

    const mainMatches = updatedContent.match(/<main[^>]*>/gi) || [];
    if (mainMatches.length > 1) {
      let mainCount = 0;
      updatedContent = updatedContent.replace(
        /<main([^>]*)>/gi,
        (match, attrs) => {
          mainCount++;
          return mainCount === 1 ? `<main${attrs}>` : `<div${attrs} role="main">`;
        }
      );
      let closeCount = 0;
      updatedContent = updatedContent.replace(
        /<\/main>/gi,
        () => {
          closeCount++;
          return closeCount === 1 ? '</main>' : '</div>';
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

      if (/<svg[^>]*>/i.test(fileContent) && !/aria-label/i.test(fileContent)) {
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