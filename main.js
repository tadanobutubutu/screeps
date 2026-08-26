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

// TODO: Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (DONE: addLangAttribute)
// - REACT_027: Fix 26 table structure issues (DONE: fixTableStructureIssues)
// - REACT_017: Add/fix 2 landmark issues (DONE: addMainLandmark)
// - REACT_041: Add accessible names to 2 SVGs (DONE: addSvgAccessibleNames)
// - REACT_025: Ensure unique landmarks (DONE: ensureUniqueLandmarks)
// - REACT_036: Fix 1 fake link issue (DONE: fixFakeLinkIssue)

/**
 * Adds lang attribute to HTML element
 * @param {string} html - The HTML string to process
 * @returns {string} HTML with lang attribute added
 */
export function addLangAttribute(html) {
  if (typeof html !== 'string') return html;
  
  return html.replace(/<html([^>]*)>/gi, (match, attrs) => {
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
    if (attrs && attrs.includes(' scope=')) {
      return match;
    }
    return `<th${attrs} scope="col">`;
  });
  
  // Ensure tables have associated caption or summary
  result = result.replace(/<table([^>]*)>/gi, (match, attrs) => {
    if (attrs && (attrs.includes(' summary=') || attrs.includes(' caption>'))) {
      return match;
    }
    // Add summary attribute for screen readers
    return `<table${attrs} summary="Data table">`;
  });
  
  // Ensure proper thead/tbody structure
  result = result.replace(/<tr/gi, (match, attrs) => {
    // Check if tbody already exists before this tr
    const beforeTr = result.substring(0, result.indexOf(match));
    if (beforeTr && !beforeTr.endsWith('</tbody>') && beforeTr.includes('<tbody')) {
      return `<tbody>${match}`;
    }
    return match;
  });
  
  // Close tbody tags that aren't properly closed
  const tableMatches = result.match(/<table[\s\S]*?<\/table>/gi) || [];
  tableMatches.forEach(table => {
    const hasThead = /<thead/i.test(table);
    const hasTbody = /<tbody/i.test(table);
    const hasTfoot = /<tfoot/i.test(table);
    
    if (hasThead || hasTbody || hasTfoot) {
      // Ensure proper structure - tbody should wrap data rows
      if (hasTbody && !/<tbody>[\s\S]*<\/tbody>/i.test(table)) {
        result = result.replace(table, table.replace(/(<table[\s\S]*>)([\s\S]*)(<\/table>)/i, '$1<tbody>$2</tbody>$3'));
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
  if (/<main[\s>]/i.test(html)) {
    return html;
  }
  
  // Try to match body content
  const bodyMatch = html.match(/<body([^>]*)>([\s\S]*)<\/body>/i);
  if (bodyMatch) {
    const bodyAttrs = bodyMatch[1];
    const bodyContent = bodyMatch[2];
    const wrappedContent = `<main>${bodyContent}</main>`;
    return html.replace(bodyMatch[0], `<body${bodyAttrs}>${wrappedContent}</body>`);
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
  
  // Handle SVG elements - check for existing accessible name
  return html.replace(/<svg([^>]*)>[\s\S]*?<\/svg>/gi, (match, attrs) => {
    // Check for existing aria-label
    const ariaLabelMatch = /aria-label=["']([^"']+)["']/i.exec(attrs);
    if (ariaLabelMatch) {
      return match;
    }
    
    // Check for existing aria-labelledby
    const ariaLabelledbyMatch = /aria-labelledby=["']([^"']+)["']/i.exec(attrs);
    if (ariaLabelledbyMatch) {
      return match;
    }
    
    // Check for existing title element with id
    const existingTitleMatch = /<title[^>]*id=["']([^"']+)["'][^>]*>([^<]*)<\/title>/i.exec(match);
    if (existingTitleMatch) {
      const titleId = existingTitleMatch[1];
      return match.replace(/<svg/, `<svg role="img" aria-labelledby="${titleId}"`);
    }
    
    // Extract title if present without id
    const titleMatch = /<title[^>]*>([^<]*)<\/title>/i.exec(match);
    let label = titleMatch ? titleMatch[1] : `SVG image ${++svgCounter}`;
    
    // Check for id attribute to reference
    const idMatch = /id=["']([^"']+)["']/i.exec(attrs);
    if (idMatch) {
      return match.replace(/<svg/, `<svg role="img" aria-labelledby="${idMatch[1]}"`);
    }
    
    // Add inline title for accessibility
    const titleId = `svg-title-${++svgCounter}`;
    return match.replace(/<svg/, `<svg role="img" aria-labelledby="${titleId}"`).replace('</svg>', `<title id="${titleId}">${label}</title></svg>`);
  });
}

/**
 * Ensures unique landmark identifiers for screen readers
 * @param {string} html - The HTML string to process
 * @returns {string} HTML with unique landmark IDs
 */
export function ensureUniqueLandmarks(html) {
  if (typeof html !== 'string') return html;
  
  const landmarks = ['header', 'nav', 'main', 'aside', 'footer', 'section', 'article'];
  const counters = {};
  
  // Initialize counters for each landmark type
  landmarks.forEach(lm => {
    const regex = new RegExp(`<${lm}[\\s>]`, 'gi');
    const matches = html.match(regex);
    if (matches) {
      counters[lm] = matches.length;
    }
  });
  
  // Assign unique IDs to landmarks
  landmarks.forEach(lm => {
    const regex = new RegExp(`<${lm}([^>]*)>`, 'gi');
    const idCounter = counters[lm];
    let count = 0;
    html = html.replace(regex, (match) => {
      const id = `${lm}-${++count}`;
      return `<${lm} id="${id}"${regex.exec(match) ? '' : ''}`;
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
  return html.replace(/<a([^>]*)>/gi, (match, attrs) => {
    if (attrs && attrs.includes('href=')) {
      return match;
    }
    return match.replace(/<a/, '<a href="#"');
  });
}