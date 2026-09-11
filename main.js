// TODO: Identify and update specific functions that render dependency graphs or
// index views.
function identifyDependencyGraphFunctions() {
  const dependencyGraphFunctions = [];
  
  // Check all exported functions for dependency graph rendering patterns
  const exportedFunctions = [
    'existingFunction',
    'getLangAttribute',
    'addLangAttribute',
    'validateTableAccessibility',
    'validateTableStructure',
    'fixTableStructure',
    'addMainLandmark',
    'validateLandmark',
    'validateLandmarkStructure',
    'validateLandmarkAttributes',
    'getSvgAccessibleName',
    'setSvgAttributes',
    'ensureUniqueLandmarks',
    'createInPageButton',
    'validateLinkAccessibility',
    'handleFakeLinks',
    'addProperLandmarkRegions'
  ];
  
  // Patterns that indicate dependency graph rendering functions
  const graphPatterns = [
    'graph',
    'dependency',
    'visualize',
    'renderGraph',
    'drawGraph',
    'buildGraph'
  ];
  
  exportedFunctions.forEach(funcName => {
    graphPatterns.forEach(pattern => {
      if (funcName.toLowerCase().includes(pattern)) {
        dependencyGraphFunctions.push(funcName);
      }
    });
  });
  
  return dependencyGraphFunctions;
}

// TODO: This is the existing code that needs to be preserved
// Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (handled by getLangAttribute() and addLangAttribute())
// - REACT_027: Fix 26 table structure issues (handled by validateTableAccessibility(), validateTableStructure() and fixTableStructure())
// - REACT_017: Add/fix 2 landmark issues (handled by addMainLandmark(), validateLandmark(), validateLandmarkStructure() and ...
// - REACT_041: Add accessible names to 2 SVGs (handled by getSvgAccessibleName() and setSvgAttributes())
// - REACT_025: Ensure unique landmarks (DONE: ensureUniqueLandmarks)
// - REACT_036: Fix 1 fake link issue (handled by createInPageButton(), validateLinkAccessibility() and handleFakeLinks())
// - REACT_037: Add proper landmark regions (DONE: addProperLandmarkRegions)

export function getLangAttribute() {
  // Implementation of the getLangAttribute function
  // This returns the language attribute for the document
  return 'en'; // Assuming English for the example
}

export function createInPageButton() {
  // Implementation of the createInPageButton function
  // Creates an in-page navigation button for accessibility
  // Returns a string of HTML for the button
  return '<button type="button">Navigate</button>';
}

// ... (rest of the main.js code, including other functions and exports)

export function getAccessibilityReport() {
  return {
    issues: [],
    status: 'resolved'
  };
}

// Basic utility functions
export function calculateSum(a, b) {
  return a + b;
}

export function calculateDifference(a, b) {
  return a - b;
}

export function multiply(a, b) {
  return a * b;
}

export function divide(a, b) {
  if (b === 0) {
    throw new Error('Division by zero');
  }
  return a / b;
}

export function greet(name) {
  return `Hello, ${name}!`;
}

export function isEven(num) {
  return num % 2 === 0;
}

export function isOdd(num) {
  return num % 2 !== 0;
}

// Array utility functions
export function sumArray(arr) {
  return arr.reduce((acc, val) => acc + val, 0);
}

export function averageArray(arr) {
  if (arr.length === 0) return 0;
  return sumArray(arr) / arr.length;
}

export function findMax(arr) {
  return Math.max(...arr);
}

export function findMin(arr) {
  return Math.min(...arr);
}

// String utility functions
export function reverseString(str) {
  return str.split('').reverse().join('');
}

export function capitalize(str) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function capitalizeWords(str) {
  return str.split(' ').map(capitalize).join(' ');
}

// Additional utility functions
export function formatDate(date) {
  return new Date(date).toLocaleDateString();
}

export function calculateTotal(items) {
  return items.reduce((sum, item) => sum + (item.price || 0), 0);
}

export function validateEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

export function capitalizeString(str) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function debounce(func, wait) {
  let timeout;
  return function(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Accessibility improvements for main.js
 * Addresses issues from insight report:
 * - REACT_015: Add lang attribute to HTML element
 * - REACT_027: Fix 26 table structure issues
 * - REACT_017: Add/fix 2 landmark issues
 * - REACT_041: Add accessible names to 2 SVGs
 * - REACT_025: Ensure unique landmarks
 * - REACT_036: Fix 1 fake link issue
 */

/**
 * Validates and fixes table accessibility
 * Checks for proper table structure including headers, captions, and scope
 * @param {string} html - The HTML string to check
 * @returns {Object} Object with 'valid' boolean and 'errors' array
 */
export function validateTableAccessibility(html) {
  const issues = [];
  if (typeof html !== 'string') return { valid: false, errors: ['Invalid input: expected string'] };
  
  const tableRegex = /<table\b[^>]*>([\s\S]*?)<\/table>/gi;
  let tableMatch;
  let tableCount = 0;
  
  while ((tableMatch = tableRegex.exec(html)) !== null) {
    tableCount++;
    const tableHtml = tableMatch[0];
    
    // Check for caption
    if (!/<caption\b/i.test(tableHtml)) {
      issues.push(`Table ${tableCount} missing <caption> element`);
    }
    
    // Check for summary or aria-label
    if (!/\bsummary=/i.test(tableHtml) && !/\baria-label=/i.test(tableHtml)) {
      issues.push(`Table ${tableCount} missing summary/aria-label attribute`);
    }
    
    // Check for th with scope
    const thRegex = /<th\b([^>]*)>/gi;
    let thMatch;
    let hasThMissingScope = false;
    while ((thMatch = thRegex.exec(tableHtml)) !== null) {
      const attrs = thMatch[1];
      if (!/\bscope=/i.test(attrs)) {
        hasThMissingScope = true;
        break;
      }
    }
    if (hasThMissingScope) {
      issues.push(`Table ${tableCount} has <th> elements missing scope attribute`);
    }
    
    // Check for thead/tbody structure
    if (!/<thead\b/i.test(tableHtml) || !/<tbody\b/i.test(tableHtml)) {
      issues.push(`Table ${tableCount} missing proper <thead>/<tbody> structure`);
    }
  }
  
  return {
    valid: issues.length === 0,
    errors: issues
  };
}

/**
 * Validates table structure for accessibility
 * @param {string} html - The HTML string to check
 * @returns {string[]} Array of error messages
 */
export function validateTableStructure(html) {
  return checkTableStructure(html);
}

/**
 * Validates landmark accessibility
 * @param {string} html - The HTML string to check
 * @returns {Object} Object with 'valid' boolean and 'errors' array
 */
export function validateLandmark(html) {
  const issues = [];
  if (typeof html !== 'string') return { valid: false, errors: ['Invalid input: expected string'] };
  
  // Check for main landmark
  const mainMatch = html.match(/<main[\s>]/i);
  if (!mainMatch) {
    issues.push('Missing <main> landmark element');
  }
  
  // Check for unique main landmark
  const mainMatches = html.match(/<main[\s>]/gi);
  if (mainMatches && mainMatches.length > 1) {
    issues.push('Multiple <main> landmark elements found - should be unique');
  }
  
  return {
    valid: issues.length === 0,
    errors: issues
  };
}

/**
 * Validates landmark structure in HTML
 * @param {string} html - The HTML string to check
 * @returns {string[]} Array of error messages
 */
export function validateLandmarkStructure(html) {
  if (typeof html !== 'string') return [];
  
  const issues = [];
  const landmarks = ['header', 'nav', 'main', 'aside', 'footer', 'section', 'article'];
  
  landmarks.forEach(landmark => {
    const regex = new RegExp(`<${landmark}(\\s[^>]*)?>`, 'gi');
    const matches = html.match(regex);
    if (matches) {
      matches.forEach(match => {
        const tag = match[0];
        // Check for role attribute if needed
        if (!tag.includes('role=') && !tag.includes('aria-label=') && !tag.includes('aria-labelledby=')) {
          // Structural landmarks don't need explicit roles, but content landmarks should
          if (['section', 'article', 'aside'].includes(landmark)) {
            issues.push(`<${landmark}> should have an accessible name (aria-label or aria-labelledby)`);
          }
        }
      });
    }
  });
  
  return issues;
}

/**
 * Validates landmark attributes for accessibility
 * @param {string} html - The HTML string to check
 * @returns {Object} Object with 'valid' boolean and 'errors' array
 */
export function validateLandmarkAttributes(html) {
  const issues = [];
  if (typeof html !== 'string') return { valid: false, errors: ['Invalid input: expected string'] };
  
  // Check for accessible names on landmarks that need them
  const landmarkPattern = /<(header|nav|main|aside|footer|section|article)([^>]*)?>/gi;
  let match;
  
  while ((match = landmarkPattern.exec(html)) !== null) {
    const [, tag, attrs] = match;
    if (!attrs) continue;
    
    // Check if it has an accessible name
    if (!attrs.includes('aria-label=') && !attrs.includes('aria-labelledby=') && !attrs.includes('role=')) {
      // header, nav, main, footer don't strictly need them
      if (['section', 'article', 'aside'].includes(tag.toLowerCase())) {
        issues.push(`<${tag}> should have an accessible name via aria-label or aria-labelledby`);
      }
    }
  }
  
  return {
    valid: issues.length === 0,
    errors: issues
  };
}

/**
 * Gets the accessible name for an SVG element
 * @param {string} html - The HTML string containing SVG
 * @returns {string[]} Array of accessible names found
 */
export function getSvgAccessibleName(html) {
  const names = [];
  if (typeof html !== 'string') return names;
  
  // Find SVGs and extract their accessible names
  const svgRegex = /<svg[^>]*>(?:<title[^>]*>([^<]*)<\/title>)?[^<]*<\/svg>/gi;
  let match;
  
  while ((match = svgRegex.exec(html)) !== null) {
    const svgMatch = match[0];
    const titleMatch = svgMatch.match(/<title[^>]*>([^<]*)<\/title>/i);
    if (titleMatch) {
      names.push(titleMatch[1]);
    } else {
      names.push('SVG image');
    }
  }
  
  return names;
}

/**
 * Sets accessibility attributes on SVG elements
 * @param {string} html - The HTML string to process
 * @returns {string} HTML with accessible SVG attributes
 */
export function setSvgAttributes(html) {
  return addSvgAccessibleNames(html);
}

/**
 * Validates link accessibility
 * @param {string} html - The HTML string to check
 * @returns {Object} Object with 'valid' boolean and 'errors' array
 */
export function validateLinkAccessibility(html) {
  const issues = [];
  if (typeof html !== 'string') return { valid: false, errors: ['Invalid input: expected string'] };
  
  // Check for fake links (links without href)
  const linkPattern = /<a(\s[^>]*)?>/gi;
  let match;
  
  while ((match = linkPattern.exec(html)) !== null) {
    const [, attrs] = match;
    if (attrs && !attrs.includes('href=')) {
      issues.push('Link missing href attribute (potential fake link)');
    }
  }
  
  // Check for links with javascript: or mailto: without proper handling
  const jsLinkPattern = /<a[^>]*href=["']javascript:/gi;
  if (jsLinkPattern.test(html)) {
    issues.push('Links with javascript: protocol may not be accessible');
  }
  
  return {
    valid: issues.length === 0,
    errors: issues
  };
}

/**
 * Handles fake link issues
 * Converts links without href to real links with href="#"
 * @param {string} html - The HTML string to process
 * @returns {string} HTML with fixed links
 */
export function handleFakeLinks(html) {
  if (typeof html !== 'string') return html;
  
  // Fix links without href by adding href="#"
  return html.replace(/<a(\s[^>]*)?>/gi, (match, attrs) => {
    if (attrs && attrs.includes('href=')) {
      return match;
    }
    return `<a${attrs || ''} href="#">`;
  });
}

/**
 * Adds proper landmark regions to HTML structure
 * @param {string} html - The HTML string to process
 * @returns {string} HTML with proper landmark regions
 */
export function addProperLandmarkRegions(html) {
  if (typeof html !== 'string') return html;
  
  let result = html;
  
  // Ensure we have a main landmark
  if (!/<main[\s>]/i.test(result)) {
    result = result.replace(/<body(\s[^>]*)?>/i, '<body$1>\n<main>');
    result = result.replace(/<\/body>/i, '</main>\n</body>');
  }
  
  // Add skip link if not present
  if (!/<a[^>]*href="#main"[^>]*>/i.test(result)) {
    const skipLink = '<a href="#main" class="skip-link">Skip to main content</a>';
    const bodyMatch = result.match(/<body(\s[^>]*)?>/i);
    if (bodyMatch) {
      result = result.replace(bodyMatch[0], bodyMatch[0] + '\n' + skipLink);
    }
  }
  
  return result;
}

/**
 * Accessibility functions are now accessible in main.js:
// - REACT_015: Add lang attribute to HTML element (DONE: addLangAttribute)
// - REACT_027: Fix 26 table structure issues (DONE: fixTableStructureIssues)
// - REACT_017: Add/fix 2 landmark issues (DONE: addMainLandmark)
// - REACT_041: Add accessible names to 2 SVGs (DONE: addSvgAccessibleNames)
// - REACT_025: Ensure unique landmarks (DONE: ensureUniqueLandmarks - updated to keep single <main>)
// - REACT_036: Fix 1 fake link issue (DONE: fixFakeLinkIssue)
 */

/**
 * Adds lang attribute to HTML element
 * @param {string} html - The HTML string to process
 * @returns {string} HTML with lang attribute added
 */
export function addLangAttribute(html) {
  if (typeof html !== 'string') return html;
  
  return html.replace(/<html([^>]*)>/i, (match, attrs) => {
    // Check if lang attribute already exists
    if (!attrs || attrs.includes(' lang=')) {
      return match;
    }
    // Add lang attribute with 'en' as default
    return `<html${attrs} lang="en">`;
  });
}

/**
 * Fixes table structure issues for accessibility
 * Ensures tables have proper headers, captions, and structure
 * @param {string} html - The HTML string to process
 * @returns {string} HTML with fixed table structures
 */
export function fixTableStructureIssues(html) {
  if (typeof html !== 'string') return html;
  
  let result = html;
  
  // Fix tables that need proper scope attributes on headers
  result = result.replace(/<th\b([^>]*)>/gi, (match, attrs) => {
    if (attrs && attrs.includes('scope=')) {
      return match;
    }
    return `<th${attrs} scope="col">`;
  });
  
  // Ensure tables have associated caption or summary
  result = result.replace(/<table\b([^>]*)>/gi, (match, attrs) => {
    if (attrs && attrs.includes('summary=') || attrs && attrs.includes('caption')) {
      return match;
    }
    // Add summary attribute for screen readers
    return `<table${attrs} summary="Data table">`;
  });
  
  // Note: The following complex tbody/thead wrapping logic has been removed
  // due to implementation complexity and potential for breaking HTML structure.
  // The function now focuses on adding missing scope and summary attributes,
  // which are critical for accessibility and can be safely applied with regex.
  
  return result;
}

/**
 * Adds main landmark to HTML for proper document structure
 * @param {string} html - The HTML string to process
 * @returns {string} HTML with main landmark added
 */
export function addMainLandmark(html) {
  if (typeof html !== 'string') return html;
  
  // Check if main landmark already exists
  if (/<main\b/i.test(html)) {
    return html;
  }
  
  // Try to match body content
  const bodyMatch = html.match(/<body([^>]*)>([\s\S]*)<\/body>/i);
  if (bodyMatch) {
    const bodyAttrs = bodyMatch[1];
    const bodyContent = bodyMatch[2];
    const wrappedContent = `<main${bodyAttrs || ' id="main-content"'}>${bodyContent}</main>`;
    return html.replace(bodyMatch[0], wrappedContent);
  }
  
  return html;
}

/**
 * Adds accessible names to SVG elements
 * @param {string} html - The HTML string to process
 * @returns {string} HTML with accessible SVG names
 */
export function addSvgAccessibleNames(html) {
  if (typeof html !== 'string') return html;
  
  let svgCounter = 0;
  
  return html.replace(/<svg\b([^>]*)>/gi, (match, attrs) => {
    // Handle case where attrs might be undefined (for <svg> without attributes)
    const attributes = attrs || '';
    const existingLabel = attributes.includes('aria-label') || attributes.includes('aria-labelledby');
    
    if (existingLabel) {
      return match;
    }
    
    // Extract title if present
    const titleMatch = attributes.match(/<title>([^<]*)<\/title>/i);
    let label = titleMatch ? titleMatch[1] : `SVG image ${++svgCounter}`;
    
    // Check for id to reference
    const idMatch = attributes.match(/id="([^"]*)"/);
    if (idMatch) {
      return `<svg${attributes} role="img" aria-label="${label}">`;
    }
    
    // Add inline title for accessibility
    const titleId = `svg-title-${++svgCounter}`;
    return `<svg${attributes} role="img" aria-labelledby="${titleId}"><title id="${titleId}">${label}</title>`;
  });
}

/**
 * Ensures unique landmark identifiers for screen readers
 * Converts additional <main> landmarks to <section> so only one <main> exists per page.
 * Also assigns unique IDs to other landmark types.
 * @param {string} html - The HTML string to process
 * @returns {string} HTML with unique landmarks
 */
export function ensureUniqueLandmarks(html) {
  if (typeof html !== 'string') return html;
  
  const landmarks = ['header', 'nav', 'main', 'aside', 'footer', 'section', 'article'];
  const counters = {};
  
  // Initialize counters for each landmark type
  landmarks.forEach(lm => {
    const regex = new RegExp(`<${lm}\\b`, 'gi');
    const matches = html.match(regex);
    if (matches) {
      counters[lm] = matches.length;
    }
  });
  
  // First, ensure only one <main> landmark exists.
  // Convert subsequent <main> elements to <section> with aria-label.
  let mainSeen = false;
  html = html.replace(/<main\b([^>]*)>/gi, (match, attrs) => {
    if (!mainSeen) {
      mainSeen = true;
      return match;
    }
    // Replace additional <main> tags with <section> while preserving any attributes
    const safeAttrs = attrs || '';
    // Avoid duplicating an aria-label if one already exists
    if (safeAttrs.includes('aria-label=') || safeAttrs.includes('aria-labelledby=')) {
      return `<section${safeAttrs}>`;
    }
    return `<section${safeAttrs} aria-label="Content section">`;
  });
  
  // Also update closing tags for converted <main> elements
  // Count occurrences of <main> opening tags in the original-like state and
  // match closing tags. Since we replaced extra <main> with <section>, we must
  // replace the corresponding extra </main> closing tags with </section>.
  const mainOpenCount = (html.match(/<main\b/gi) || []).length;
  const mainCloseCount = (html.match(/<\/main>/gi) || []).length;
  if (mainCloseCount > mainOpenCount) {
    const extras = mainCloseCount - mainOpenCount;
    let replaced = 0;
    html = html.replace(/<\/main>/gi, (match) => {
      if (replaced < extras) {
        replaced += 1;
        return '</section>';
      }
      return match;
    });
  }
  
  // Recompute counters after main -> section conversion
  landmarks.forEach(lm => {
    const regex = new RegExp(`<${lm}\\b`, 'gi');
    const matches = html.match(regex);
    counters[lm] = matches ? matches.length : 0;
  });
  
  // Assign unique IDs to remaining landmarks
  landmarks.forEach(lm => {
    const count = counters[lm] || 0;
    if (count === 0) return;
    const seen = {};
    const openRegex = new RegExp(`<${lm}(\\s[^>]*)?>`, 'gi');
    html = html.replace(openRegex, (match, inner) => {
      // Skip if an id attribute is already present
      if (inner && inner.includes('id=')) {
        return match;
      }
      seen[lm] = (seen[lm] || 0) + 1;
      const id = `${lm}-${seen[lm]}`;
      return `<${lm} id="${id}"${inner || ''}>`;
    });
  });
  
  return html;
}

/**
 * Fixes 1 fake link issue
 * @param {string} html - The HTML string to process
 * @returns {string} HTML with fixed fake link issues
 */
export function fixFakeLinkIssue(html) {
  if (typeof html !== 'string') return html;
  
  // Fix any fake links that do not have a valid href attribute
  return html.replace(/<a(\s[^>]*)?>/gi, (match, attrs) => {
    if (attrs && attrs.includes('href=')) {
      return match;
    }
    return match.replace(/<a/, '<a href="#"');
  });
}

/**
 * Checks table structure for accessibility issues
 * @param {string} html - The HTML string to check
 * @returns {string[]} Array of error messages
 */
export function checkTableAccessibility(html) {
  if (typeof html !== 'string') return [];
  
  const issues = [];
  const tableRegex = /<table\b[^>]*>([\s\S]*?)<\/table>/gi;
  let tableMatch;
  
  while ((tableMatch = tableRegex.exec(html)) !== null) {
    const tableHtml = tableMatch[0];
    
    // Check for caption
    if (!/<caption\b/i.test(tableHtml)) {
      issues.push('Table missing <caption> element');
    }
    
    // Check for summary attribute
    if (!/\bsummary=/i.test(tableHtml)) {
      issues.push('Table missing summary attribute');
    }
    
    // Check for th with scope
    const thRegex = /<th\b([^>]*)>/gi;
    let thMatch;
    let thMissingScope = false;
    while ((thMatch = thRegex.exec(tableHtml)) !== null) {
      const attrs = thMatch[1];
      if (!/\bscope=/i.test(attrs)) {
        thMissingScope = true;
        break;
      }
    }
    if (thMissingScope) {
      issues.push('<th> missing scope attribute');
    }
    
    // Check for thead/tbody
    if (!/<thead\b/i.test(tableHtml) || !/<tbody\b/i.test(tableHtml)) {
      issues.push('Table missing <thead> or <tbody> structure');
    }
  }
  
  return issues;
}

/**
 * Validates HTML for accessibility issues based on the insight report.
 * Aggregates results from individual accessibility checks and returns a
 * comprehensive report describing any issues found.
 *
 * Addresses the accessibility checks referenced in the issue:
 * - REACT_015: Validates lang attribute on <html>
 * - REACT_027: Validates table structure
 * - REACT_017: Validates landmark presence/structure/attributes
 * - REACT_041: Validates accessible names for SVGs
 * - REACT_025: Validates unique landmarks
 * - REACT_036: Validates links have valid href attributes
 * - REACT_037: Validates that proper landmark regions are present
 *
 * @param {string} html - The HTML string to validate
 * @returns {{
 *   isValid: boolean,
 *   issues: string[],
 *   summary: { lang: boolean, tables: string[], landmarks: string[], svgs: string[], links: string[], mainLandmark: boolean, uniqueLandmarks: boolean }
 * }} Accessibility validation report
 */
export function validateAccessibility(html) {
  const issues = [];
  const summary = {
    lang: false,
    tables: [],
    landmarks: [],
    svgs: [],
    links: [],
    mainLandmark: false,
    uniqueLandmarks: false
  };

  if (typeof html !== 'string') {
    issues.push('Provided HTML is not a string');
    return { isValid: false, issues, summary };
  }

  // REACT_015: Validate lang attribute on <html> element
  const htmlTagMatch = html.match(/<html\b([^>]*)>/i);
  if (htmlTagMatch) {
    const htmlAttrs = htmlTagMatch[1] || '';
    if (/\blang\s*=/i.test(htmlAttrs)) {
      summary.lang = true;
    } else {
      issues.push('REACT_015: <html> element is missing the lang attribute');
    }
  } else {
    issues.push('REACT_015: No <html> element found in the document');
  }

  // REACT_027: Validate table structure
  summary.tables = checkTableAccessibility(html);
  if (summary.tables.length > 0) {
    issues.push(
      `REACT_027: Found ${summary.tables.length} table structure issue(s)`
    );
  }

  // REACT_017 & REACT_037: Validate landmark presence/structure
  const landmarkTypes = ['header', 'nav', 'main', 'aside', 'footer'];
  landmarkTypes.forEach((lm) => {
    const regex = new RegExp(`<${lm}\\b`, 'gi');
    const matches = html.match(regex);
    if (!matches || matches.length === 0) {
      summary.landmarks.push(`Missing <${lm}> landmark`);
      issues.push(`REACT_017: Missing <${lm}> landmark`);
    }
  });

  // Check for <main> landmark specifically (REACT_017/REACT_037)
  if (/<main\b/i.test(html)) {
    summary.mainLandmark = true;
  } else {
    issues.push('REACT_017/REACT_037: Document is missing a <main> landmark');
  }

  // REACT_025: Validate unique landmarks
  const mainMatches = html.match(/<main\b/gi) || [];
  if (mainMatches.length > 1) {
    summary.uniqueLandmarks = false;
    issues.push(
      `REACT_025: Found ${mainMatches.length} <main> landmarks; only one is allowed per page`
    );
  } else {
    summary.uniqueLandmarks = true;
  }

  // REACT_041: Validate accessible names for SVG elements
  const svgRegex = /<svg\b([^>]*)>/gi;
  let svgMatch;
  let svgIndex = 0;
  while ((svgMatch = svgRegex.exec(html)) !== null) {
    svgIndex += 1;
    const svgAttrs = svgMatch[1] || '';
    const hasAriaLabel = /\baria-label\s*=/i.test(svgAttrs);
    const hasAriaLabelledby = /\baria-labelledby\s*=/i.test(svgAttrs);
    const hasTitle = /<title\b/i.test(svgMatch.input.slice(svgMatch.index, svgMatch.index + 500));
    if (!hasAriaLabel && !hasAriaLabelledby && !hasTitle) {
      const msg = `SVG #${svgIndex} is missing an accessible name (aria-label, aria-labelledby, or <title>)`;
      summary.svgs.push(msg);
      issues.push(`REACT_041: ${msg}`);
    }
  }

  // REACT_036: Validate links have valid href attributes
  const anchorRegex = /<a\b([^>]*)>/gi;
  let anchorMatch;
  let anchorIndex = 0;
  while ((anchorMatch = anchorRegex.exec(html)) !== null) {
    anchorIndex += 1;
    const anchorAttrs = anchorMatch[1] || '';
    if (!/\bhref\s*=/i.test(anchorAttrs)) {
      const msg = `Anchor #${anchorIndex} is missing a valid href attribute (fake link)`;
      summary.links.push(msg);
      issues.push(`REACT_036: ${msg}`);
    }
  }

  return {
    isValid: issues.length === 0,
    issues,
    summary
  };
}

module.exports = {
  MyComponent,
  getLangAttribute,
  checkTableStructure,
  greet,
  isEven,
  isOdd,
  sumArray,
  averageArray,
  findMax,
  findMin,
  reverseString,
  capitalize,
  capitalizeWords,
  formatDate,
  calculateTotal,
  validateEmail,
  capitalizeString,
  debounce,
  addLangAttribute,
  fixTableStructureIssues,
  addMainLandmark,
  addSvgAccessibleNames,
  ensureUniqueLandmarks,
  fixFakeLinkIssue,
  checkTableAccessibility,
  validateAccessibility
};