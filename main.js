// TODO: This is the existing code that needs to be preserved (This comment remains as-is)
// Functions to ensure the element has an id, add aria-label, render dependency graphs
// (Previously existing code that needs to be preserved)
// Importing the necessary functions (for illustration purposes)
import { getLangAttribute, createInPageButton } from './utils/accessibilityUtils';
import { validateTableAccessibility, validateTableStructure } from './utils/tableAccessibilityUtils';
import { validateLinkAccessibility, handleFakeLinks } from './utils/linkAccessibilityUtils';

// TODO: Implement calculateDiscount
function calculateDiscount(originalPrice, discountPercentage) {
  const discountAmount = originalPrice * (discountPercentage / 100);
  return originalPrice - discountAmount;
}

// Function for addressing accessibility issues from insight report
function addressAccessibilityIssues(insightReport) {
  // Function body: Implement the logic to address the accessibility issues based on the insight report
  // For example:
  // - Iterate over the insightReport and apply accessibility fixes
  // - Return a result indicating success or failure
  // - Update the application state or external resources as needed

  // Apply accessibility fixes to HTML content based on insight report
  if (insightReport && insightReport.html) {
    insightReport.html = applyAccessibilityFixes(insightReport.html);
  }

  // Implement the changes required to address accessibility issues from the insight report
  // For example, this could be calling existing utility functions to validate accessibility
  const linkIssues = checkLinkAccessibility();
  const tableIssues = validateTableAccessibility();
  const tableStructureIssues = validateTableStructure();
  const linkAccessibilityIssues = validateLinkAccessibility();
  const fakeLinkIssues = handleFakeLinks();

  // Handle issues (e.g., log them, display warnings, etc.)
  // For demonstration purposes, we will just log the issues to the console
  console.log('Addressing accessibility issues from insight report:', insightReport);
  console.log('Link Accessibility Issues:', linkIssues);
  console.log('Table Accessibility Issues:', tableIssues);
  console.log('Table Structure Issues:', tableStructureIssues);
  console.log('Link Accessibility Validation Issues:', linkAccessibilityIssues);
  console.log('Fake Link Issues:', fakeLinkIssues);

  // Here you could add additional logic to address the issues
  // For example, you might want to update the DOM or call other functions

  // Placeholder return statement
  return {
    success: true,
    message: 'Accessibility issues addressed successfully'
  };
}

/**
 * Creates a unique identifier for a landmark given a base name.
 * @param {string} baseName - Base name of the landmark.
 * @returns {string} Unique ID.
 */
function uniqueLandmarkId(baseName) {
    let candidate = baseName;
    if (_usedLandmarkIds.has(candidate)) {
        // Collision handling: add random suffix
        const suffix = Math.floor(Math.random() * 9000) + 1000;
        candidate = `${baseName}-${suffix}`;
    }
    _usedLandmarkIds.add(candidate);
    return candidate;
}

// Example of adding a new function
function newFunction() {
  // Function body
}

// TODO: This is the new function request
function newRequestedFunction() {
  // New function body
}

// REACT_015: Add lang attribute to the <html> element
function addLangAttribute(html, lang = 'en') {
    if (typeof html !== 'string') return html;
    return html.replace(/<html([^>]*)>/i, (match, attrs) => {
        if (/\blang=/i.test(match)) return match;
        return `<html${attrs} lang="${lang}">`;
    });
}

// REACT_027: Fix table structure issues (add thead, tbody, th scope, caption)
function fixTableStructure(html) {
    if (typeof html !== 'string') return html;

    // Ensure every table has a caption
    html = html.replace(/<table([^>]*)>/gi, (match, attrs) => {
        if (/<caption/i.test(match)) return match;
        return `<table${attrs}><caption></caption>`;
    });

    // Close caption and wrap rows in thead/tbody where missing
    html = html.replace(/<table([^>]*)>([\s\S]*?)<\/table>/gi, (match, attrs, content) => {
        if (/<thead/i.test(content)) return match;
        const rows = content.match(/<tr[^>]*>[\s\S]*?<\/tr>/gi) || [];
        if (rows.length === 0) return match;
        const firstRows = rows.slice(0, 1).join('');
        const restRows = rows.slice(1).join('');
        const thPattern = /<td>/gi;
        const firstRowHasTh = thPattern.test(firstRows);
        let thead = '';
        let tbody = restRows;

        if (!firstRowHasTh) {
            thead = `<thead>${firstRows.replace(/<td>/gi, '<th scope="col">').replace(/<\/td>/gi, '</th>')}</thead>`;
        } else {
            thead = `<thead>${firstRows}</thead>`;
        }
        if (!tbody) tbody = '';
        tbody = `<tbody>${tbody}</tbody>`;

        return `<table${attrs}>${thead}${tbody}</table>`;
    });

    // Add scope="col" to th elements that don't have it
    html = html.replace(/<th([^>]*)>/gi, (match, attrs) => {
        if (/\bscope=/i.test(match)) return match;
        return `<th${attrs} scope="col">`;
    });

    return html;
}

/**
 * Divides two numbers with proper error handling
 * @param {number} dividend - The number to be divided
 * @param {number} divisor - The number to divide by
 * @returns {number} The result of the division
 * @throws {Error} If divisor is zero or if inputs are not valid numbers
 */
function divide(dividend, divisor) {
  if (typeof dividend !== 'number' || typeof divisor !== 'number') {
    throw new Error('Both arguments must be numbers');
  }
  
  if (isNaN(dividend) || isNaN(divisor)) {
    throw new Error('Both arguments must be valid numbers');
  }
  
  if (divisor === 0) {
    throw new Error('Division by zero is not allowed');
  }
  
  return dividend / divisor;
}

// REACT_017: Add/fix landmark issues
function fixLandmarks(html) {
    if (typeof html !== 'string') return html;

    // Ensure <main> landmark exists
    if (!/<main[^>]*>/i.test(html) && !/<div[^>]*role=["']main["']/i.test(html)) {
        html = html.replace(
            /<body([^>]*)>/i,
            '<body$1><main>'
        );
        html = html.replace(/<\/body>/i, '</main></body>');
    }

    // Ensure <nav> landmark exists
    if (!/<nav[^>]*>/i.test(html) && !/<div[^>]*role=["']navigation["']/i.test(html)) {
        html = html.replace(
            /<main[^>]*>/i,
            '<nav aria-label="Main navigation"></nav><main>'
        );
    }

    // Ensure <aside> landmark exists if content suggests a sidebar
    if (!/<aside[^>]*>/i.test(html) && !/<div[^>]*role=["']complementary["']/i.test(html)) {
        html = html.replace(
            /<\/main>/i,
            '<aside aria-label="Supplementary"></aside></main>'
        );
    }

    // Ensure <footer> landmark exists
    if (!/<footer[^>]*>/i.test(html) && !/<div[^>]*role=["']contentinfo["']/i.test(html)) {
        html = html.replace(
            /<\/body>/i,
            '<footer></footer></body>'
        );
    }

    return html;
}

// REACT_041: Add accessible names to SVGs
function addSvgAccessibleNames(html) {
    if (typeof html !== 'string') return html;

    const svgMatches = [...html.matchAll(/<svg([^>]*)>/gi)];
    let offset = 0;

    svgMatches.forEach((match, index) => {
        const fullMatch = match[0];
        const attrs = match[1];
        const svgStart = match.index + offset;
        const svgEnd = html.indexOf('</svg>', svgStart);

        if (svgEnd === -1) return;

        const svgContent = html.substring(svgStart, svgEnd + 6);
        const hasTitle = /<title/i.test(svgContent);
        const hasAriaLabel = /\baria-label=/i.test(attrs);
        const hasAriaLabelledBy = /\baria-labelledby=/i.test(attrs);

        if (!hasTitle && !hasAriaLabel && !hasAriaLabelledBy) {
            const newSvg = fullMatch.replace(/>/, `><title>SVG ${index + 1}</title>`);
            const oldSvgLength = svgContent.length;
            html = html.substring(0, svgStart) + newSvg + html.substring(svgStart + oldSvgLength);
            offset += newSvg.length - oldSvgLength;
        }
    });

    return html;
}

function checkLinkAccessibility() {
  // Implementation for checking link accessibility
  // This function will be used to validate the accessibility of links
  const links = document.querySelectorAll('a[href]');
  const issues = [];
  
  links.forEach(link => {
    const href = link.getAttribute('href');
    const text = link.textContent.trim();
    
    if (!text) {
      issues.push(`Link with href "${href}" has no accessible text`);
    }
  });
  
  return issues;
}

// TODO: Implement wrapPrimaryContentInMain function, including the added logic
/**
 * Wraps the primary content of the page in a <main> element for improved accessibility.
 * This function checks if a <main> element already exists; if not, it creates one
 * and moves all body content into it.
 * @returns {Element|null} The <main> element if successfully created/wrapped, or null if body is not available
 */
function wrapPrimaryContentInMain() {
  const body = document.body;
  
  // Return null if body element is not available
  if (!body) {
    return null;
  }
  
  // Check if a <main> element already exists to avoid duplication
  const existingMain = document.querySelector('main');
  if (existingMain) {
    return existingMain;
  }
  
  // Create a new <main> element
  const main = document.createElement('main');
  
  // Move all existing body children into the <main> element
  while (body.firstChild) {
    main.appendChild(body.firstChild);
  }
  
  // Append the <main> element to the body
  body.appendChild(main);
  
  return main;
}

// REACT_025: Ensure unique landmarks
function ensureUniqueLandmarks(html) {
    if (typeof html !== 'string') return html;

    const landmarkRoles = ['banner', 'navigation', 'main', 'complementary', 'contentinfo', 'search', 'form'];

    landmarkRoles.forEach(role => {
        const pattern = new RegExp(`role=["']${role}["']`, 'gi');
        const matches = html.match(pattern);
        if (matches && matches.length > 1) {
            // Keep first occurrence, change subsequent ones
            let count = 0;
            html = html.replace(pattern, (match) => {
                count++;
                if (count === 1) return match;
                return `role="region"`;
            });
        }
    });

    // Also check for duplicate HTML5 landmark elements (header, nav, main, aside, footer)
    const html5Landmarks = ['header', 'nav', 'main', 'aside', 'footer'];
    html5Landmarks.forEach(tag => {
        const pattern = new RegExp(`<${tag}[^>]*>`, 'gi');
        const matches = html.match(pattern);
        if (matches && matches.length > 1) {
            // Keep first, add role="region" to others
            let count = 0;
            html = html.replace(pattern, (match) => {
                count++;
                if (count === 1) return match;
                return match.replace(new RegExp(`<${tag}`, 'i'), `<${tag} role="region"`);
            });
        }
    });

    return html;
}

// REACT_036: Fix fake link issues
function fixFakeLinks(html) {
    if (typeof html !== 'string') return html;

    // Find spans or divs with onclick that act as links and convert to <a>
    html = html.replace(
        /<span([^>]*)onclick=["']([^"']*)["']([^>]*)>/gi,
        (match, before, onclick, after) => {
            const hrefMatch = onclick.match(/window\.location\s*=\s*['"]([^'"]+)['"]/);
            if (hrefMatch) {
                return `<a href="${hrefMatch[1]}"${before}${after}>`;
            }
            return match;
        }
    );

    html = html.replace(/<\/span>/gi, '</a>');

    return html;
}

// Main function that applies all accessibility fixes
function applyAccessibilityFixes(html) {
    let result = html;
    result = addLangAttribute(result);
    result = fixTableStructure(result);
    result = fixLandmarks(result);
    result = addSvgAccessibleNames(result);
    result = ensureUniqueLandmarks(result);
    result = fixFakeLinks(result);
    return result;
}

/**
 * Adds an aria-label attribute to an element if it doesn't already have one.
 * @param {HTMLElement} elementId - The element to add the aria-label to.
 * @param {string} label - The label text to be added.
 */
function addAriaLabel(elementId, label) {
    const element = typeof elementId === 'string' ? document.getElementById(elementId) : elementId;
    if (element) {
        element.setAttribute('aria-label', label);
    }
}

// Add lang attribute to HTML element
document.documentElement.setAttribute('lang', getLangAttribute());

// Ensure elements have the required IDs
function ensureElementHasId(elementId) {
  const element = document.getElementById(elementId);
  if (element && !element.id) {
    element.setAttribute('id', elementId);
  }
}

// Helper function to make header focusable for keyboard navigation
function makeHeaderFocusable() {
  const header = document.querySelector('header');
  if (header) {
    header.setAttribute('tabindex', '0');
    header.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        header.focus();
      }
    });
  }
}

// Add ARIA labels for better screen reader support
addAriaLabel('myTable', 'Product data table');
addAriaLabel('myLogo', 'Company logo');
addAriaLabel('accessibilityMenu', 'Accessibility menu');

// DOM-based accessibility code

function getFullLangAttribute() {
  // Implementation for getting full lang attribute
  return 'en-US'; // Example implementation
}

function getLangAttribute() {
  // Implementation for getting lang attribute
  return getFullLangAttribute();
}

function personName() {
  // Existing code...
}

function validateLandmark() {
  // Existing code...
}

function validateLandmarkStructure() {
  // Existing code...
}

function validateTableAccessibility(table) {
  // Implementation for validating table accessibility
  if (!table) return;
  // Add accessibility checks for table
  const headers = table.querySelectorAll('th');
  headers.forEach(th => {
    if (!th.hasAttribute('scope')) {
      // Determine if th is a column header or row header
      const row = th.parentElement;
      if (row && row.cells && row.cells[0] === th) {
        th.setAttribute('scope', 'row');
      } else {
        th.setAttribute('scope', 'col');
      }
    }
  });
}

function validateTableStructure(table) {
  // Implementation for validating table structure
  if (!table) return;
  // Add structure validation logic
}

function ensureElementsHaveIds(elements) {
  return Array.from(elements).map((element, index) => {
    if (!element.id) {
      element.id = `element-${index}`;
    }
    return element;
  });
}

// Added function to ensure unique landmarks as mentioned in the issue
function ensureUniqueLandmarks() {
  // Implementation for ensuring unique landmarks
  // Remove duplicate landmarks
  const landmarks = document.querySelectorAll(
    'header[role="banner"]',
    'nav[role="navigation"]',
    'main[role="main"]'
  );

  const seenLandmarks = new Set();
  landmarks.forEach((landmark) => {
    const tagName = landmark.tagName.toLowerCase();
    const role = landmark.getAttribute('role') || '';
    const key = `${tagName}-${role}`;
    
    if (seenLandmarks.has(key)) {
      // Remove role attribute from duplicate landmarks
      landmark.removeAttribute('role');
    } else {
      seenLandmarks.add(key);
    }
  });
}

function getSvgAccessibleName(svg) {
  // Get accessible name for SVG based on context or title
  if (!svg) return '';
  
  // Check for title element within SVG
  const title = svg.querySelector('title');
  if (title && title.textContent.trim()) {
    return title.textContent.trim();
  }
  
  // Check for aria-label attribute
  const ariaLabel = svg.getAttribute('aria-label');
  if (ariaLabel) {
    return ariaLabel;
  }
  
  // Check for adjacent text that describes the SVG
  const parent = svg.parentElement;
  if (parent) {
    const textContent = parent.textContent;
    if (textContent.trim()) {
      return textContent.trim();
    }
  }
  
  return 'Decorative image';
}

function setSvgAttributes(svg, accessibleName) {
  // Implementation for setting SVG attributes
  if (!svg) return;
  // Add accessible name to SVG
  if (!svg.getAttribute('aria-label') && !svg.querySelector('title')) {
    svg.setAttribute('aria-label', accessibleName);
  }
}

function createInPageButton() {
  // Implementation for creating in-page button
  const button = document.createElement('button');
  button.setAttribute('aria-label', 'Skip to main content');
  button.textContent = 'Skip to main content';
  button.className = 'skip-link';
  button.style.position = 'absolute';
  button.style.top = '-40px';
  button.style.left = '0';
  button.style.background = '#000';
  button.style.color = '#fff';
  button.style.padding = '8px';
  button.style.zIndex = '10000';
  
  button.addEventListener('focus', () => {
    button.style.top = '0';
  });
  
  button.addEventListener('blur', () => {
    button.style.top = '-40px';
  });
  
  document.body.insertBefore(button, document.body.firstChild);
  return button;
}

// Added function to create accessible links as mentioned in the issue
function createAccessibleLink(text, href) {
  // Implementation for creating accessible link
  const link = document.createElement('a');
  link.href = href;
  link.textContent = text;
  link.setAttribute('aria-label', text);
  return link;
}

// Added function to handle accessibility issues as mentioned in the issue
function handleAccessibilityIssues() {
  // Implementation for handling all accessibility issues
  // This could coordinate the calling of other accessibility functions
  ensureUniqueLandmarks();
  // Add other accessibility issue handling as needed
}

// New function to fix accessibility issues as per the insight report
function fixAccessibilityIssues() {
  // New code to fix accessibility issues...
  ensureUniqueLandmarks();
  fixFakeLinkIssues();
}

function validateLinkAccessibility() {
  // Implementation for validating link accessibility
  const links = document.querySelectorAll('a');
  const results = [];
  
  links.forEach((link, index) => {
    const hasText = link.textContent.trim().length > 0;
    const hasAriaLabel = link.hasAttribute('aria-label');
    const hasTitle = link.hasAttribute('title');
    
    results.push({
      index,
      href: link.getAttribute('href'),
      text: link.textContent,
      accessible: hasText || hasAriaLabel || hasTitle
    });
  });
  
  return results;
}

function handleFakeLinks() {
  // Implementation for handling fake links (elements styled as links but not using <a> tag)
  const fakeLinks = document.querySelectorAll('[role="link"], .fake-link');
  
  fakeLinks.forEach((element) => {
    const tagName = element.tagName.toLowerCase();
    
    // If it's not an anchor but has role="link", convert it properly
    if (tagName !== 'a' && element.getAttribute('role') === 'link') {
      // Ensure it has proper keyboard navigation
      if (!element.hasAttribute('tabindex')) {
        element.setAttribute('tabindex', '0');
      }
      
      // Add click handler for keyboard users
      element.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          element.click();
        }
      });
    }
  });
}

// Create in-page button with accessibility considerations
createInPageButton();

// Ensure button has an id and appropriate ARIA label
const myButton = document.getElementById('myButton');
const myIcon = document.getElementById('myIcon');

if (myButton) {
  addAriaLabel(myButton, 'My Button');
}

if (myIcon) {
  addAriaLabel(myIcon, 'My Icon');
}

// Validate table structure and accessibility
// Ensuring all tables in the document are accessible
const tables = document.querySelectorAll('table');
tables.forEach(table => {
  validateTableAccessibility(table);
  validateTableStructure(table);
});

// New function to address REACT_036: Fix 1 fake link issue
function fixFakeLinkIssues() {
    // Fix fake link issues
    const buttonsStyledAsLinks = document.querySelectorAll('button.link-style, [role="link"]');
    
    buttonsStyledAsLinks.forEach((element) => {
      // Check if it should be a link
      const href = element.getAttribute('data-href');
      if (href) {
        // Convert to proper anchor element
        const link = document.createElement('a');
        link.href = href;
        link.textContent = element.textContent;
        link.className = element.className;
        
        // Copy ARIA attributes
        const ariaLabel = element.getAttribute('aria-label');
        if (ariaLabel) {
          link.setAttribute('aria-label', ariaLabel);
        }
        
        // Replace the element
        element.parentNode.replaceChild(link, element);
      } else {
        // Ensure proper button role
        if (element.getAttribute('role') !== 'button') {
          element.setAttribute('role', 'button');
        }
        
        // Ensure keyboard accessibility
        if (!element.hasAttribute('tabindex')) {
          element.setAttribute('tabindex', '0');
        }
      }
    });
}

// Google sign-in accessibility
// Ensuring Google sign-in button has proper accessible name and role
function googleSignIn() {
  const googleButton = document.querySelector('.google-sign-in, [data-provider="google"]');
  if (googleButton) {
    googleButton.setAttribute('aria-label', 'Sign in with Google');
    googleButton.setAttribute('role', 'button');
  }
}

// Add lang attribute to HTML element
document.documentElement.setAttribute('lang', getLangAttribute());

// Add/fix landmark issues
validateLandmark();
validateLandmarkStructure();
ensureUniqueLandmarks();

// Add accessible names to SVGs
const svgs = document.querySelectorAll('svg');
svgs.forEach(svg => {
  const accessibleName = getSvgAccessibleName(svg);
  setSvgAttributes(svg, accessibleName);
});

// Validate link accessibility
validateLinkAccessibility();
handleFakeLinks();

// Fix button identifiers
// Ensuring all buttons have proper accessible identifiers
document.addEventListener('DOMContentLoaded', () => {
});

function createInPageButton(buttonId, buttonText, buttonClass) {
    const button = document.createElement('button');
    button.id = buttonId;
    button.textContent = buttonText;
    button.className = buttonClass;
    document.body.appendChild(button);
}

// Don't forget to test your new additions in the test file

// Export the function for testing and external use
module.exports = { newFunction, newRequestedFunction };

// Export accessibility utility functions
export {
  getLangAttribute,
  createInPageButton,
  validateTableAccessibility,
  validateTableStructure,
  validateLinkAccessibility,
  handleFakeLinks,
  checkLinkAccessibility,
  newFunction,
  newRequestedFunction,
  addressAccessibilityIssues,
  addLangAttribute,
  fixTableStructure,
  fixLandmarks,
  addSvgAccessibleNames,
  ensureUniqueLandmarks,
  fixFakeLinks,
  applyAccessibilityFixes,
  divide,
  wrapPrimaryContentInMain
};