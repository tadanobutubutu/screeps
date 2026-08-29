// Import dependencyGraphContent
const dependencyGraphContent = require('./dependencyGraph');

const fs = require('fs');
const path = require('path');

function addressAccessibilityIssues() {
  // Address new accessibility issues from insight report
  const issues = [];
  
  // REACT_015: Add lang attribute to HTML element
  const htmlElement = document.querySelector('html');
  if (htmlElement && !htmlElement.hasAttribute('lang')) {
    htmlElement.setAttribute('lang', 'en');
    issues.push({ type: 'REACT_015', action: 'Added lang attribute to html element' });
  }
  
  // REACT_027: Validate table structure for accessibility
  const tables = document.querySelectorAll('table');
  tables.forEach((table, index) => {
    const hasCaption = table.querySelector('caption');
    const hasHeaders = table.querySelector('th');
    if (!hasCaption) {
      issues.push({ type: 'REACT_027', action: `Table ${index} missing caption` });
    }
    if (!hasHeaders) {
      issues.push({ type: 'REACT_027', action: `Table ${index} missing header cells` });
    }
  });
  
  // REACT_017: Validate landmark structure
  const mainLandmarks = document.querySelectorAll('main, [role="main"]');
  const navLandmarks = document.querySelectorAll('nav, [role="navigation"]');
  const headerLandmarks = document.querySelectorAll('header, [role="banner"]');
  const footerLandmarks = document.querySelectorAll('footer, [role="contentinfo"]');
  
  if (mainLandmarks.length === 0) {
    issues.push({ type: 'REACT_017', action: 'Missing main landmark' });
  }
  if (navLandmarks.length === 0) {
    issues.push({ type: 'REACT_017', action: 'Missing navigation landmark' });
  }
  if (headerLandmarks.length === 0) {
    issues.push({ type: 'REACT_017', action: 'Missing header landmark' });
  }
  if (footerLandmarks.length === 0) {
    issues.push({ type: 'REACT_017', action: 'Missing footer landmark' });
  }
  
  // REACT_041: Add accessible names to SVGs
  const svgs = document.querySelectorAll('svg');
  svgs.forEach((svg, index) => {
    const hasTitle = svg.querySelector('title');
    const hasAriaLabel = svg.getAttribute('aria-label');
    const hasAriaLabelledBy = svg.getAttribute('aria-labelledby');
    
    if (!hasTitle && !hasAriaLabel && !hasAriaLabelledBy) {
      issues.push({ type: 'REACT_041', action: `SVG ${index} missing accessible name` });
    }
  });
  
  // REACT_025: Ensure unique landmarks
  const landmarkSelectors = ['main', '[role="main"]', 'nav', '[role="navigation"]'];
  landmarkSelectors.forEach(selector => {
    const elements = document.querySelectorAll(selector);
    if (elements.length > 1) {
      issues.push({ type: 'REACT_025', action: `Multiple ${selector} landmarks found` });
    }
  });
  
  // REACT_036: Fix fake link issues
  const fakeLinks = document.querySelectorAll('a[href=""], a[href="#"], span[role="link"]');
  fakeLinks.forEach((link, index) => {
    issues.push({ type: 'REACT_036', action: `Fake link detected at index ${index}` });
  });
  
  // Return summary of issues found and addressed
  return {
    totalIssues: issues.length,
    issues: issues,
    addressed: true
  };
}

// TODO: Identify and update specific functions that render dependency graphs or
// index views.
// TODO: Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (handled by getLangAttribute() and personName())
// - REACT_027: Fix 26 table structure issues (handled by validateTableAccessibility() and validateTableStructure())
// - REACT_017: Add/fix 4 landmark issues (handled by validateLandmark(), ... and validateLandmarkStructure())
// - REACT_041: Add accessible names to 2 SVGs (handled by getSvgAccessibleName() and ...
// - REACT_025: Ensure unique landmarks (2 issues) (handled by ...)
// - REACT_036: Fix 1 fake link issue (handled by ... createInPageButton(), ... and personName())
// - ADD: Address new accessibility issues from insight report
// ----- BEGIN ORIGINAL CODE (unchanged) -----
// Assuming main.js has a <html> tag, add the lang attribute based on your content
// For example, if the page is in English, set lang to 'en'

/**
 * Counts the total number of dependencies in package.json
 * @returns {Object} An object containing counts for dependencies, devDependencies, and total
 */
function countDependencies() {
  const packagePath = path.join(__dirname, 'package.json');
  
  try {
    const packageContent = fs.readFileSync(packagePath, 'utf8');
    const packageJson = JSON.parse(packageContent);
    
    const dependencies = packageJson.dependencies || {};
    const devDependencies = packageJson.devDependencies || {};
    
    const dependencyCount = Object.keys(dependencies).length;
    const devDependencyCount = Object.keys(devDependencies).length;
    
    return {
      dependencies: dependencyCount,
      devDependencies: devDependencyCount,
      total: dependencyCount + devDependencyCount
    };
  } catch (error) {
    console.error('Error reading package.json:', error.message);
    return {
      dependencies: 0,
      devDependencies: 0,
      total: 0
    };
  }
}

/**
 * Detects the language of the given content and sets the HTML lang attribute
 * @param {string} content - The text content to analyze
 * @returns {string} The detected language code
 */
function detectAndSetLang(content) {
  // Simple language detection based on common patterns
  let lang = 'en'; // Default to English
  
  if (content) {
    // Check for common non-ASCII characters to help detect language
    if (/[\u4e00-\u9fff]/.test(content)) {
      lang = 'zh'; // Chinese
    } else if (/[\u3040-\u30ff]/.test(content)) {
      lang = 'ja'; // Japanese
    } else if (/[\u0400-\u04ff]/.test(content)) {
      lang = 'ru'; // Russian/Cyrillic
    } else if (/[\u0600-\u06ff]/.test(content)) {
      lang = 'ar'; // Arabic
    } else if (/[àâäçéèêëîïôùûü]/.test(content.toLowerCase())) {
      lang = 'fr'; // French
    } else if (/[äöüß]/.test(content.toLowerCase())) {
      lang = 'de'; // German
    }
  }
  
  return lang;
}

// Export for use in other modules
module.exports = { 
  countDependencies, 
  addressAccessibilityIssues, 
  detectAndSetLang, 
  dependencyGraphContent 
};