/**
 * Accessibility improvements for main.js
 * Addresses issues from insight report:
 * - REACT_015: Add lang attribute to HTML element (DONE: addLangAttribute)
 * - REACT_027: Fix 26 table structure issues (DONE: fixTableStructureIssues)
 * - REACT_017: Add/fix 2 landmark issues
 * - REACT_041: Add accessible names to 2 SVGs (DONE: addSvgAccessibleNames)
 * - REACT_025: Ensure unique landmarks (DONE: ensureUniqueLandmarks - updated to keep single <main>)
 * - REACT_036: Fix 1 fake link issue (DONE: fixFakeLinkIssue)
 */

// TODO: Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (DONE: addLangAttribute)
// - REACT_027: Fix 26 table structure issues (DONE: fixTableStructureIssues)
// - REACT_017: Add/fix 2 landmark issues (NEW: addMainLandmark)
// - REACT_041: Add accessible names to 2 SVGs (DONE: addSvgAccessibleNames)
// - REACT_025: Ensure unique landmarks (DONE: ensureUniqueLandmarks - updated to keep single <main>)
// - REACT_036: Fix 1 fake link issue (DONE: fixFakeLinkIssue)

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
  result = result.replace(/<th([^>]*)>/gi, (match, attrs) => {
    if (attrs && attrs.includes('scope=')) {
      return match;
    }
    return `<th${attrs} scope="col">`;
  });

  // Ensure tables have associated caption or summary
  result = result.replace(/<table([^>]*)>/gi, (match, attrs) => {
    if (attrs && (attrs.includes('summary=') || attrs.includes('caption>'))) {
      return match;
    }
    // Add summary attribute for screen readers
    return `<table${attrs} summary="Data table">`;
  });

  // Ensure proper thead/tbody structure
  result = result.replace(/(<tr[^>]*>)/gi, (match, attrs) => {
    // Check if tbody already exists before this tr
    const trIndex = result.indexOf(match);
    const beforeTr = result.substring(0, trIndex);
    if (beforeTr && !beforeTr.includes('<tbody') && !beforeTr.includes('<thead')) {
      return `<tbody>${match}`;
    }
    return match;
  });

  // Close tbody tags that aren't properly closed
  const tableMatches = result.match(/<table[^>]*>[\s\S]*?<\/table>/gi) || [];
  tableMatches.forEach(table => {
    const hasThead = /<thead/i.test(table);
    const hasTbody = /<tbody/i.test(table);
    const hasTfoot = /<tfoot/i.test(table);

    if (hasThead || hasTbody || hasTfoot) {
      // Ensure proper structure - tbody should wrap data rows
      if (hasTbody && !/<tbody>[\s\S]*<\/tbody>/i.test(table)) {
        result = result.replace(table, table.replace(/(<table[^>]*>)([\s\S]*?)(<\/table>)/i, '$1<tbody>$2</tbody>$3'));
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
  if (/<main[^>]*>/i.test(html)) {
    return html;
  }

  // Try to match body content
  const bodyMatch = html.match(/<body([^>]*)>([\s\S]*)<\/body>/i);
  if (bodyMatch) {
    const bodyAttrs = bodyMatch[1];
    const bodyContent = bodyMatch[2];
    const wrappedContent = `<main id="main-content">${bodyContent}</main>`;
    return html.replace(bodyMatch[0], `<body${bodyAttrs}>${wrappedContent}</body>`);
  }

  return html;
}

// The following functions remain unchanged

/**
 * Adds accessible names to SVG elements
 * @param {string} html - The HTML string to process
 * @returns {string} HTML with accessible SVG names
 */
export function addSvgAccessibleNames(html) {
  // ...
}

/**
 * Ensures unique landmark identifiers for screen readers
 * Converts additional <main> landmarks to <section> so only one <main> exists per page.
 * Also assigns unique IDs to other landmark types.
 * @param {string} html - The HTML string to process
 * @returns {string} HTML with unique landmarks
 */
export function ensureUniqueLandmarks(html) {
  // ...
}

/**
 * Fixes 1 fake link issue
 * @param {string} html - The HTML string to process
 * @returns {string} HTML with fixed fake link issues
 */
export function fixFakeLinkIssue(html) {
  // ...
}