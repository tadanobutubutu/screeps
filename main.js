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

// TODO: Address accessibility issues from insight report — FIXED (combined with the export code)
// - REACT_015: Add lang attribute to HTML element (DONE: addLangAttribute)
// - REACT_027: Fix 26 table structure issues (DONE: fixTableStructureIssues)
// - REACT_017: Add/fix 2 landmark issues (DONE: addMainLandmark)
// - REACT_041: Add accessible names to 2 SVGs (DONE: addSvgAccessibleNames)
// - REACT_025: Ensure unique landmarks (DONE: ensureUniqueLandmarks - updated to keep single <main>)
// - REACT_036: Fix 1 fake link issue (DONE: fixFakeLinkIssue)

/**
 * Adds lang attribute to HTML element
 * @param {string} html - The HTML string to process
 * @returns {string} HTML with lang attribute added
 */
export function ... {
  if (typeof html !== 'string') return html;
  
  return ... (match, attrs) => {
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
export function ... {
  if (typeof html !== 'string') return html;
  
  let result = html;
  
  // Fix tables that need proper scope attributes on headers
  result = ... (match, attrs) => {
    if (attrs && ... {
      return match;
    }
    return `<th${attrs} scope="col">`;
  });
  
  // Ensure tables have associated caption or summary
  result = ... (match, attrs) => {
    if (attrs && ... || ... {
      return match;
    }
    // Add summary attribute for screen readers
    return `<table${attrs} summary="Data table">`;
  });
  
  // Ensure proper thead/tbody structure
  result = ... (match, attrs) => {
    // Check if tbody already exists before this tr
    const trIndex = ...
    const beforeTr = result.substring(0, trIndex);
    if (beforeTr && ... && ... {
      return `<tbody>${match}`;
    }
    return match;
  });
  
  // Close tbody tags that aren't properly closed
  const tableMatches = ... || [];
  tableMatches.forEach(table => {
    const hasThead = /<thead/i.test(table);
    const hasTbody = /<tbody/i.test(table);
    const hasTfoot = /<tfoot/i.test(table);
    
    if (hasThead || hasTbody || hasTfoot) {
      // Ensure proper structure - tbody should wrap data rows
      if (hasTbody && ... {
        result = result.replace(table, ... '$1<tbody>$2</tbody>$3'));
      }
    }
  });
  
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
  if ... {
    return html;
  }
  
  // Try to match body content
  const bodyMatch = ...
  if (bodyMatch) {
    const bodyAttrs = bodyMatch[1];
    const bodyContent = bodyMatch[2];
    const wrappedContent = `<main ...
    return ... ...
  }
  
  return html;
}

/**
 * Adds accessible names to SVG elements
 * @param {string} html - The HTML string to process
 * @returns {string} HTML with accessible SVG names
 */
export function ... {
  if (typeof html !== 'string') return html;
  
  let svgCounter = 0;
  
  return ... (match, attrs) => {
    const existingLabel = attrs.match(/aria-label=/) || ...
    
    if (existingLabel) {
      return match;
    }
    
    // Extract title if present
    const titleMatch = ...
    let label = titleMatch ? titleMatch[1] : `SVG image ${++svgCounter}`;
    
    // Check for id to reference
    const idMatch = ...
    if (idMatch) {
      return `<svg${attrs} role="img" ...
    }
    
    // Add inline title for accessibility
    const titleId = ...
    return `<svg${attrs} role="img" aria-labelledby="${titleId}"><title ...
  });
}

/**
 * Ensures unique landmark identifiers for screen readers
 * Converts additional <main> landmarks to <section> so only one <main> exists per page.
 * Also assigns unique IDs to other landmark types.
 * @param {string} html - The HTML string to process
 * @returns {string} HTML with unique landmarks
 */
export function ... {
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
  html = ... (match, attrs) => {
    if (!mainSeen) {
      mainSeen = true;
      return match;
    }
    // Replace additional <main> tags with <section> while preserving any attributes
    const safeAttrs = attrs || '';
    // Avoid duplicating an aria-label if one already exists
    if ... || ... {
      return ...
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
    html = ... (match) => {
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
    const openRegex = new ... 'gi');
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
export function ... {
  if (typeof html !== 'string') return html;
  
  // Fix any fake links that do not have a valid href attribute
  return ... (match, attrs) => {
    if (attrs && ... {
      return match;
    }
    return match.replace(/<a/, '<a href="#"');
  });
}

/**
 * Checks landmark elements for accessibility compliance
 * Validates that landmarks have proper accessible names and unique identifiers
 * @param {string} html - The HTML string to process
 * @returns {object} Object containing landmark analysis results
 */
export function checkLandmarkElements(html) {
  if (typeof html !== 'string') return { valid: true, issues: [] };
  
  const issues = [];
  const landmarks = ['header', 'nav', 'main', 'aside', 'footer', 'section', 'article'];
  
  // Check for duplicate landmark IDs
  const idRegex = /id\s*=\s*["']([^"']+)["']/gi;
  const foundIds = {};
  let idMatch;
  
  while ((idMatch = idRegex.exec(html)) !== null) {
    const idValue = idMatch[1];
    if (foundIds[idValue]) {
      issues.push({
        type: 'duplicate-id',
        message: `Duplicate ID "${idValue}" found`,
        position: idMatch.index
      });
    } else {
      foundIds[idValue] = true;
    }
  }
  
  // Check each landmark type
  landmarks.forEach(lm => {
    const regex = new