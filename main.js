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
  const dir = 'docs';
  let files;
  try {
    files = await fs.readdir(dir);
  } catch (err) {
    console.log(`Directory ${dir} not found, skipping main landmark addition`);
    return;
  }
  const htmlFiles = files.filter(f => f.endsWith('.html'));
  for (const file of htmlFiles) {
    const filePath = path.join(dir, file);
    let content;
    try {
      content = await fs.readFile(filePath, 'utf8');
    } catch (err) {
      console.log(`Error reading ${file}, skipping`);
      continue;
    }
    if (!/<main[\s>]/i.test(content)) {
      let modified = content.replace(/<body([^>]*)>/i, (match, attrs) => {
        return `<body${attrs}><main id="main">`;
      });
      modified = modified.replace(/<\/body>/i, '</main></body>');
      if (modified !== content) {
        await fs.writeFile(filePath, modified);
        console.log(`Added main landmark to ${file}`);
      }
    }
  }
}

/**
 * Adds a function to modify the HTML content with the `lang` attribute.
 * This can be used to handle more complex scenarios, such as multiple languages in one file.
 */
async function addLangToFiles() {
  const dir = 'docs';
  let files;
  try {
    files = await fs.readdir(dir);
  } catch (err) {
    console.log(`Directory ${dir} not found, skipping lang attribute addition`);
    return;
  }
  const htmlFiles = files.filter(f => f.endsWith('.html'));
  for (const file of htmlFiles) {
    const filePath = path.join(dir, file);
    let content;
    try {
      content = await fs.readFile(filePath, 'utf8');
    } catch (err) {
      console.log(`Error reading ${file}, skipping`);
      continue;
    }
    const modified = addLangAttribute(content);
    if (modified !== content) {
      await fs.writeFile(filePath, modified);
      console.log(`Added lang attribute to ${file}`);
    }
  }
}

/**
 * Replaces hash links with buttons for better accessibility
 */
async function replaceHashLinksWithButtons() {
  const dir = 'docs';
  let files;
  try {
    files = await fs.readdir(dir);
  } catch (err) {
    console.log(`Directory ${dir} not found, skipping hash link replacement`);
    return;
  }
  const htmlFiles = files.filter(f => f.endsWith('.html'));
  for (const file of htmlFiles) {
    const filePath = path.join(dir, file);
    let content;
    try {
      content = await fs.readFile(filePath, 'utf8');
    } catch (err) {
      console.log(`Error reading ${file}, skipping`);
      continue;
    }
    const modified = content.replace(
      /<a\s+[^>]*href\s*=\s*["']\s*#?!?\s*["'][^>]*>([\s\S]*?)<\/a>/gi,
      (match, inner) => `<button>${inner}</button>`
    );
    if (modified !== content) {
      await fs.writeFile(filePath, modified);
      console.log(`Replaced hash links with buttons in ${file}`);
    }
  }
}

/**
 * Fixes table structure issues by ensuring tables have proper structure
 * with required elements like <thead>, <tbody>, and proper headers
 */
async function fixTableStructure() {
  const dir = 'docs';
  let files;
  try {
    files = await fs.readdir(dir);
  } catch (err) {
    console.log(`Directory ${dir} not found, skipping table structure fix`);
    return;
  }
  const htmlFiles = files.filter(f => f.endsWith('.html'));
  for (const file of htmlFiles) {
    const filePath = path.join(dir, file);
    let content;
    try {
      content = await fs.readFile(filePath, 'utf8');
    } catch (err) {
      console.log(`Error reading ${file}, skipping`);
      continue;
    }
    const modified = content.replace(/<table[^>]*>([\s\S]*?)<\/table>/gi, (match, inner) => {
      let innerContent = inner;
      // Ensure thead exists
      if (!/<thead[\s>]/i.test(innerContent)) {
        let replaced = false;
        innerContent = innerContent.replace(
          /<tr([^>]*)>([\s\S]*?)<\/tr>/i,
          (trMatch, trAttrs, trContent) => {
            if (replaced) return trMatch;
            replaced = true;
            return `<thead><tr${trAttrs}>${trContent}</tr></thead>`;
          }
        );
      }
      // Ensure tbody exists
      if (!/<tbody[\s>]/i.test(innerContent)) {
        if (/<thead[\s>]/i.test(innerContent)) {
          innerContent = innerContent.replace(/<\/thead>/i, '</thead><tbody>');
          innerContent = innerContent.replace(/(?=<\/table>)/i, '</tbody>');
        } else {
          innerContent = `<tbody>${innerContent}</tbody>`;
        }
      }
      // Add scope="col" to th in thead
      innerContent = innerContent.replace(
        /(<thead[\s\S]*?<th)([^>]*)(>)/gi,
        (m, p1, p2, p3) => {
          if (/scope/i.test(p2)) return m;
          return `${p1}${p2} scope="col"${p3}`;
        }
      );
      // Add scope="row" to th in tbody
      innerContent = innerContent.replace(
        /(<tbody[\s\S]*?<th)([^>]*)(>)/gi,
        (m, p1, p2, p3) => {
          if (/scope/i.test(p2)) return m;
          return `${p1}${p2} scope="row"${p3}`;
        }
      );
      const tableAttrMatch = match.match(/<table([^>]*)>/i);
      const attrs = tableAttrMatch ? tableAttrMatch[1] : '';
      return `<table${attrs}>${innerContent}</table>`;
    });
    if (modified !== content) {
      await fs.writeFile(filePath, modified);
      console.log(`Fixed table structure in ${file}`);
    }
  }
}

/**
 * Ensures unique landmarks in the HTML content
 * Addresses REACT_025: Ensure unique landmarks
 */
async function ensureUniqueLandmarks() {
  const dir = 'docs';
  let files;
  try {
    files = await fs.readdir(dir);
  } catch (err) {
    console.log(`Directory ${dir} not found, skipping unique landmarks check`);
    return;
  }
  const htmlFiles = files.filter(f => f.endsWith('.html'));
  for (const file of htmlFiles) {
    const filePath = path.join(dir, file);
    let content;
    try {
      content = await fs.readFile(filePath, 'utf8');
    } catch (err) {
      console.log(`Error reading ${file}, skipping`);
      continue;
    }
    const originalContent = content;
    const landmarks = ['main', 'nav', 'aside', 'header', 'footer', 'section', 'article'];
    for (const role of landmarks) {
      const regex = new RegExp(`<${role}[\\s>]`, 'gi');
      const matches = content.match(regex);
      if (matches && matches.length > 1) {
        let counter = 1;
        content = content.replace(
          new RegExp(`<${role}([^>]*)>`, 'gi'),
          (match, attrs) => {
            if (/aria-label/i.test(attrs)) return match;
            const label = `${role} ${counter}`;
            counter++;
            return `<${role}${attrs} aria-label="${label}">`;
          }
        );
      }
    }
    if (content !== originalContent) {
      await fs.writeFile(filePath, content);
      console.log(`Ensured unique landmarks in ${file}`);
    }
  }
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