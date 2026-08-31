// TODO: This is the existing code that needs to be preserved
// (This comment remains as-is)
// _Commit: eef4b6be04a5e2cd61b75c43cfe2dff2da0857ca2_
// <!-- todo-hash: 4798ccecb0ac0a8c0f11ea9eebbacc3bee5d9b2 -->
// _Commit: f8051b788bad4952d8493f08d3c7d22a06ff80d3_
// <!-- todo-hash: b498b47abee4b3f29c69a9762237d968a50cc419 -->
// _Commit: 30b5f0892a59d5ec914a59aa66e32dc3a3eb059e_
// <!-- todo-hash: 1f81632535b0749b809ac49f5e1c81cf4389f9c1 -->

// This is the existing code that needs to be preserved
// Functions to ensure the element has an id, add aria-label, render dependency graphs
// (Previously existing code that needs to be preserved)

// This is the code that needs to be preserved and is common between both branches
// ...

// TODO: New code that was added to the branch
// New function that does something different

// This is the existing code that needs to be preserved
// ...

// New code that was added to the branch, but should not overwrite the preserved code
// ...
const https = require('https');
const http = require('http');
const React = require('react');
const { dependencyGraphContent } = require('./dependencyGraphContent');
const { indexContent } = require('./indexContent');

/**
 * Renders a dependency graph view using the imported dependencyGraphContent module.
 * @returns {string} The rendered dependency graph content
 */
function renderDependencyGraph() {
  return dependencyGraphContent;
}

/**
 * Renders an index view using the imported indexContent module.
 * @returns {string} The rendered index content
 */
function renderIndexView() {
  return indexContent;
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
    } else if (/[\u3040-\u309f\u30a0-\u30ff]/.test(content)) {
      lang = 'ja'; // Japanese
    } else if (/[\u0400-\u04ff]/.test(content)) {
      lang = 'ru'; // Russian/Cyrillic
    } else if (/[\u0600-\u06ff]/.test(content)) {
      lang = 'ar'; // Arabic
    } else if (/[àâäéèêëïîôùûüç]/i.test(content)) {
      lang = 'fr'; // French
    } else if (/[äöüß]/i.test(content)) {
      lang = 'de'; // German
    }
  }
  
  setHtmlLangAttribute(lang);
  return lang;
}

// TODO: Address new accessibility issues from insight report ( implement new functions and fixes as needed)
// Example new function to improve keyboard navigation
function improveKeyboardNavigation() {
  // New code to improve accessibility
}

// New code to implement the fix for the accessibility issue
// Assuming the insight report indicated that a certain button needed to be focusable
document.querySelector('.focusable-button').setAttribute('tabindex', '0');

// Before:
document.documentElement.lang = '';

// After:
document.documentElement.lang = 'en'; // Replace 'en' with the appropriate language code

const someFunction = () => {
  // some existing implementation
};

// New function to create an in-page button
const createInPageButton = (text, url) => {
  const button = document.createElement('a');
  button.textContent = text;
  button.setAttribute('href', url);
  button.style.display = 'none';
  document.body.appendChild(button);
  return button;
};

// New function to validate link accessibility and handle fake links
const validateLinkAccessibility = () => {
  const links = document.getElementsByTagName('a');
  for (let i = 0; i < links.length; i++) {
    const link = links[i];
    if (link.href.startsWith('#') || !link.hasAttribute('href')) {
      handleFakeLinks(link);
    }
  }
};

// New function to handle fake links by wrapping them in an in-page button
const handleFakeLinks = (link) => {
  const fakeLinkButton = createInPageButton(link.textContent, link.href);
  link.textContent = '';
  link.setAttribute('target', '_top');
  link.addEventListener('click', (event) => {
    event.preventDefault();
    fakeLinkButton.click();
  });
};

/**
 * Check if a link/URL is accessible
 * @param {string} url - The URL to check
 * @param {number} timeout - Request timeout in milliseconds (default: 5000)
 * @returns {Promise<{accessible: boolean, statusCode: number|null, error: string|null}>}
 */
function isLinkAccessible(url, timeout = 5000) {
    return new Promise((resolve) => {
        if (!url || typeof url !== 'string') {
            resolve({ accessible: false, statusCode: null, error: 'Invalid URL' });
            return;
        }

        let parsedUrl;
        try {
            parsedUrl = new URL(url);
        } catch (e) {
            resolve({ accessible: false, statusCode: null, error: 'Malformed URL' });
            return;
        }

        const protocol = parsedUrl.protocol === 'https:' ? https : http;
        const options = {
            hostname: parsedUrl.hostname,
            port: parsedUrl.port,
            path: parsedUrl.pathname + parsedUrl.search,
            method: 'HEAD',
            timeout: timeout,
        };

        const req = protocol.request(options, (res) => {
            const accessible = res.statusCode >= 200 && res.statusCode < 400;
            resolve({ accessible, statusCode: res.statusCode, error: null });
        });

        req.on('error', (e) => {
            resolve({ accessible: false, statusCode: null, error: e.message });
        });

        req.on('timeout', () => {
            req.destroy();
            resolve({ accessible: false, statusCode: null, error: 'Request timeout' });
        });

        req.end();
    });
}

function checkLinkAndButtonAccessibility() {
  const issues = [];

  const links = document.querySelectorAll('a');
  links.forEach((link, index) => {
    const hasAccessibleName =
      link.textContent.trim() !== '' ||
      link.getAttribute('aria-label') !== null ||
      link.getAttribute('aria-labelledby') !== null;
    if (!hasAccessibleName) {
      issues.push({ type: 'link', element: link, index });
    }
  });

  const buttons = document.querySelectorAll('button');
  buttons.forEach((button, index) => {
    const hasAccessibleName =
      button.textContent.trim() !== '' ||
      button.getAttribute('aria-label') !== null ||
      button.getAttribute('aria-labelledby') !== null;
    if (!hasAccessibleName) {
      issues.push({ type: 'button', element: button, index });
    }
  });

  return issues;
}

// New function to address REACT_017: Add/fix 4 landmark issues
function validateLandmark(element) {
  if (typeof document === 'undefined' || !element) {
    return { valid: false, errors: ['Element not found'] };
  }
  
  const errors = [];
  const validLandmarks = ['header', 'nav', 'main', 'aside', 'footer', 'section', 'article', 'search'];
  
  // Check if element is a valid landmark
  const role = element.getAttribute('role');
  const tagName = element.tagName.toLowerCase();
  
  if (role && !validLandmarks.includes(role)) {
    errors.push(`Invalid landmark role: ${role}`);
  }
  
  if (!role && !validLandmarks.includes(tagName)) {
    errors.push(`Element is not a valid landmark: ${tagName}`);
  }
  
  // Check for accessible name
  const hasLabel = element.getAttribute('aria-label') || 
                   element.getAttribute('aria-labelledby') ||
                   element.querySelector('h1, h2, h3, h4, h5, h6');
  
  if (!hasLabel) {
    errors.push('Landmark is missing accessible name (aria-label, aria-labelledby, or heading)');
  }
  
  return { valid: errors.length === 0, errors };
}

function validateLandmarkStructure() {
  if (typeof document === 'undefined') {
    return { valid: false, errors: ['Document not available'] };
  }
  
  const errors = [];
  
  // Check for multiple main landmarks
  const mainElements = document.querySelectorAll('main, [role="main"]');
  if (mainElements.length > 1) {
    errors.push(`Multiple main landmarks found (${mainElements.length}). Only one main landmark should exist.`);
  }
  
  // Check for proper nesting of landmarks
  const landmarks = document.querySelectorAll('nav, main, aside, footer, [role]');
  landmarks.forEach((landmark) => {
    const parent = landmark.parentElement;
    while (parent) {
      const parentTag = parent.tagName.toLowerCase();
      const parentRole = parent.getAttribute('role');
      
      // Check for invalid nesting
      if (parentTag === 'header' && parentTag === 'header') {
        errors.push('Nested header elements found');
      }
      if (parentTag === 'footer' && parentTag === 'footer') {
        errors.push('Nested footer elements found');
      }
      
      parent = parent.parentElement;
    }
  });

  return { valid: errors.length === 0, errors };
}

// New function to address REACT_041: Add accessible names to 2 SVGs
function getSvgAccessibleName(svgElement) {
  if (typeof document === 'undefined' || !svgElement) {
    return null;
  }
  
  // Check for aria-label
  let accessibleName = svgElement.getAttribute('aria-label');
  if (accessibleName) return accessibleName;
  
  // Check for aria-labelledby referencing another element
  const labelledBy = svgElement.getAttribute('aria-labelledby');
  if (labelledBy) {
    const labelElement = document.getElementById(labelledBy);
    if (labelElement) {
      return labelElement.textContent;
    }
  }
  
  // Check for title element inside SVG
  const titleElement = svgElement.querySelector('title');
  if (titleElement) {
    return titleElement.textContent;
  }
  
  return null;
}

/**
 * Check multiple links for accessibility
 * @param {string[]} urls - Array of URLs to check
 * @param {number} timeout - Request timeout in milliseconds
 * @returns {Promise<Array<{url: string, accessible: boolean, statusCode: number|null, error: string|null}>>}
 */
async function checkMultipleLinks(urls, timeout = 5000) {
    if (!Array.isArray(urls)) {
        throw new Error('URLs must be an array');
    }
    
    const results = await Promise.all(
        urls.map(async (url) => {
            const result = await isLinkAccessible(url, timeout);
            return { url, ...result };
        })
    );
    
    return results;
}

// ... existing code ...

// TODO: This is the existing code that needs to be preserved

// Placeholder for functionA (existing functionality)
function functionA() {
    // TODO: Implement actual logic for functionA
    console.log('functionA called (placeholder)');
}

// Placeholder for functionB (existing functionality)
function functionB() {
    // TODO: Implement actual logic for functionB
    console.log('functionB called (placeholder)');
}

// Corrected exports for new functions
export function calculateSum(a, b) {
  return a + b;
}

export function calculateProduct(a, b) {
  return a * b;
}

// Additional new function or changes requested in the issue
// Example: a new function to process some data
function processData(data) {
    // Implementation details for processing data
    // ...
}

// TODO: Implement function for addressing accessibility issues from insight report
function addressAccessibilityIssues(insightReport) {
  // Placeholder logic for addressing accessibility issues
  // This function should be implemented to parse the insightReport and apply appropriate accessibility fixes
  console.log('Addressing accessibility issues:', insightReport);
}

module.exports = {
    someFunction: someFunction,
    createInPageButton: createInPageButton,
    validateLinkAccessibility: validateLinkAccessibility,
    handleFakeLinks: handleFakeLinks,
    isLinkAccessible,
    checkMultipleLinks,
    checkLinkAndButtonAccessibility,
    validateLandmark,
    validateLandmarkStructure,
    getSvgAccessibleName,
    processData,
    addressAccessibilityIssues,
    functionA,
    functionB,
    renderDependencyGraph,
    renderIndexView,
    detectAndSetLang
};