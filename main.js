var loop = require('main/loop');
var roles = require('main/roles');

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
// - REACT_025: Ensure unique landmarks (DONE: ensureUniqueLandmarks - updated to keep single <main>)
// - REACT_036: Fix 1 fake link issue (DONE: fixFakeLinkIssue)

/**
 * Adds lang attribute to HTML element
 * @param {string} html - The HTML string to process
 * @returns {string} HTML with lang attribute added
 */
function addLangAttribute(html) {
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
function fixTableStructureIssues(html) {
  if (typeof html !== 'string') return html;
  
  let result = html;
  
  // Fix tables that need proper scope attributes on headers
  result = result.replace(/<th([^>]*)>/gi, (match, attrs) => {
    if (attrs.includes('scope=')) {
      return match;
    }
    return `<th${attrs} scope="col">`;
  });
  
  // Ensure tables have associated caption or summary
  result = result.replace(/<table([^>]*)>/gi, (match, attrs) => {
    if (attrs.includes('summary=') || attrs.includes('aria-describedby=')) {
      return match;
    }
    // Add summary attribute for screen readers
    return `<table${attrs} summary="Data table">`;
  });
  
  // Ensure proper thead/tbody structure
  result = result.replace(/<tr([^>]*)>/gi, (match, attrs) => {
    // Check if tbody already exists before this tr
    const beforeTr = result.substring(0, result.indexOf(match));
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
      if (hasTbody && !table.includes('</tbody>')) {
        result = result.replace(table, table.replace(/(<table[^>]*>[\s\S]*?<tbody>)([\s\S]*?)(<\/table>)/, '$1<tbody>$2</tbody>$3'));
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
function addMainLandmark(html) {
  if (typeof html !== 'string') return html;
  
  // Check if main landmark already exists
  if (/<main[\s>]/i.test(html)) {
    return html;
  }
  
  // Try to match body content
  const bodyMatch = /<body([^>]*)>([\s\S]*)<\/body>/i.exec(html);
  if (bodyMatch) {
    const bodyAttrs = bodyMatch[1];
    const bodyContent = bodyMatch[2];
    const wrappedContent = `<main role="main">${bodyContent}</main>`;
    return html.replace(/<body([^>]*)>[\s\S]*<\/body>/i, `<body${bodyAttrs}>${wrappedContent}</body>`);
  }
  
  return html;
}

/**
 * Adds accessible names to SVG elements
 * @param {string} html - The HTML string to process
 * @returns {string} HTML with accessible SVG names
 */
function addSvgAccessibleNames(html) {
  if (typeof html !== 'string') return html;
  
  let svgCounter = 0;
  
  return html.replace(/<svg([^>]*)>/gi, (match, attrs) => {
    const existingLabel = attrs.includes('aria-label=') || attrs.includes('aria-labelledby=');
    
    if (existingLabel) {
      return match;
    }
    
    // Extract title if present
    const titleMatch = /<title[^>]*>([^<]+)<\/title>/i.exec(match);
    let label = titleMatch ? titleMatch[1] : `SVG image ${++svgCounter}`;
    
    // Check for id to reference
    const idMatch = /\bid="([^"]+)"/i.exec(attrs);
    if (idMatch) {
      return `<svg${attrs} role="img" aria-labelledby="${idMatch[1]}">`;
    }
    
    // Add inline title for accessibility
    const titleId = `svg-title-${++svgCounter}`;
    return `<svg${attrs} role="img" aria-labelledby="${titleId}"><title id="${titleId}">${label}</title></svg>`;
  });
}

/**
 * Ensures unique landmark identifiers for screen readers
 * Converts additional <main> landmarks to <section> so only one <main> exists per page.
 * Also assigns unique IDs to other landmark types.
 * @param {string} html - The HTML string to process
 * @returns {string} HTML with unique landmarks
 */
function ensureUniqueLandmarks(html) {
  if (typeof html !== 'string') return html;
  
  const landmarks = ['header', 'nav', 'main', 'aside', 'footer', 'section', 'article'];
  const counters = {};
  
  // Initialize counters for each landmark type
  landmarks.forEach(lm => {
    const regex = new RegExp(`<${lm}(?:\\s[^>]*)?>`, 'gi');
    const matches = html.match(regex);
    if (matches) {
      counters[lm] = matches.length;
    }
  });
  
  // First, ensure only one <main> landmark exists.
  // Convert subsequent <main> elements to <section> with aria-label.
  let mainSeen = false;
  html = html.replace(/<main(\s[^>]*)?>/gi, (match, attrs) => {
    if (!mainSeen) {
      mainSeen = true;
      return match;
    }
    // Replace additional <main> tags with <section> while preserving any attributes
    const safeAttrs = attrs || '';
    // Avoid duplicating an aria-label if one already exists
    if (/aria-label\s*=/i.test(safeAttrs) || /aria-labelledby\s*=/i.test(safeAttrs)) {
      return `<section${safeAttrs}>`;
    }
    return `<section${safeAttrs} aria-label="Content section">`;
  });
  
  // Also update closing tags for converted <main> elements
  // Count occurrences of <main> opening tags in the original-like state and
  // match closing tags. Since we replaced extra <main> with <section>, we must
  // replace the corresponding extra </main> closing tags with </section>.
  const mainOpenCount = (html.match(/<main(\s[^>]*)?>/gi) || []).length;
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
    const regex = new RegExp(`<${lm}(?:\\s[^>]*)?>`, 'gi');
    const matches = html.match(regex);
    counters[lm] = matches ? matches.length : 0;
  });
  
  // Assign unique IDs to remaining landmarks
  landmarks.forEach(lm => {
    const count = counters[lm] || 0;
    if (count === 0) return;
    const seen = {};
    const openRegex = new RegExp(`<${lm}((\\s[^>]*)?)>`, 'gi');
    html = html.replace(openRegex, (match, _inner) => {
      // Skip if an id attribute is already present
      if (/\bid\s*=/i.test(match)) {
        return match;
      }
      seen[lm] = (seen[lm] || 0) + 1;
      const id = `${lm}-${seen[lm]}`;
      return match.replace(`<${lm}`, `<${lm} id="${id}"`);
    });
  });
  
  return html;
}

/**
 * Fixes 1 fake link issue
 * @param {string} html - The HTML string to process
 * @returns {string} HTML with fixed fake link issues
 */
function fixFakeLinkIssue(html) {
  if (typeof html !== 'string') return html;
  
  // Fix any fake links that do not have a valid href attribute
  return html.replace(/<a([^>]*)>/gi, (match, attrs) => {
    if (attrs.includes('href=')) {
      return match;
    }
    return match.replace(/<a/, '<a href="#"');
  });
}

// Attach accessibility functions to the loop object for backward compatibility
loop.addLangAttribute = addLangAttribute;
loop.fixTableStructureIssues = fixTableStructureIssues;
loop.addMainLandmark = addMainLandmark;
loop.addSvgAccessibleNames = addSvgAccessibleNames;
loop.ensureUniqueLandmarks = ensureUniqueLandmarks;
loop.fixFakeLinkIssue = fixFakeLinkIssue;

module.exports = loop;