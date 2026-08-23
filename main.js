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
  
  return html.replace(/<html([^>]*)>/i, (match, attrs) => {
    // Check if lang attribute already exists
    if (attrs.includes('lang=') || attrs.includes(' lang=')) {
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
    if (attrs.includes('scope=')) {
      return match;
    }
    return `<th${attrs} scope="col">`;
  });
  
  // Ensure tables have associated caption or summary
  result = result.replace(/(<table([^>]*)>)(?!.*(caption|summary))/gi, (match, openTag, attrs) => {
    if (attrs.includes('summary=')) {
      return openTag;
    }
    // Add summary attribute for screen readers
    return `<table${attrs} summary="Data table">`;
  });
  
  // Ensure proper thead/tbody structure
  result = result.replace(/<tr([^>]*)>(?!((?!<tr)[\s\S])*<\/tbody>)/gi, (match, attrs) => {
    // Check if tbody already exists before this tr
    const beforeTr = result.substring(0, result.indexOf(match));
    if (!beforeTr.includes('<tbody') && !beforeTr.includes('<thead')) {
      return `<tbody>${match}`;
    }
    return match;
  });
  
  // Close tbody tags that aren't properly closed
  const tableMatches = result.match(/<table[\s\S]*?<\/table>/gi) || [];
  tableMatches.forEach(table => {
    const hasThead = table.includes('<thead');
    const hasTbody = table.includes('<tbody');
    const hasTfoot = table.includes('<tfoot');
    
    if (hasThead || hasTbody || hasTfoot) {
      // Ensure proper structure - tbody should wrap data rows
      if (hasTbody && !table.match(/<tbody>[\s\S]*<\/tbody>/)) {
        result = result.replace(table, table.replace(/(<table[\s\S]*)(<tr)/, '$1<tbody>$2'));
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
  
  // Wrap content in main landmark
  // Try to match body content
  const bodyMatch = html.match(/<body([^>]*)>([\s\S]*?)<\/body>/i);
  if (bodyMatch) {
    const bodyAttrs = bodyMatch[1];
    const bodyContent = bodyMatch[2];
    const wrappedContent = `<main${bodyAttrs}>${bodyContent}</main>`;
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
  
  return html.replace(/<svg([^>]*)>/gi, (match, attrs) => {
    const existingLabel = attrs.includes('aria-label') || attrs.includes('aria-labelledby');
    
    if (existingLabel) {
      return match;
    }
    
    // Extract title if present
    const titleMatch = match.match(/<title[^>]*>([^<]*)<\/title>/i);
    let label = titleMatch ? titleMatch[1] : `SVG image ${++svgCounter}`;
    
    // Check for id to reference
    const idMatch = attrs.match(/id="([^"]*)"/);
    if (idMatch) {
      return `<svg${attrs} role="img" aria-labelledby="title-${idMatch[1]}">`;
    }
    
    // Add inline title for accessibility
    const titleId = `svg-title-${svgCounter}`;
    return `<svg${attrs} role="img" aria-labelledby="${titleId}"><title id="${titleId}">${label}</title>`;
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
    const regex = new RegExp(`<${lm}[^>]*>`, 'gi');
    const matches = html.match(regex);
    counters[lm] = matches ? matches.length : 0;
  });
  
  // Add aria-labels to duplicate landmarks
  let result = html;
  landmarks.forEach(lm => {
    if (counters[lm] > 1) {
      let instanceCount = 0;
      const regex = new RegExp(`<${lm}([^>]*)>`, 'gi');
      result = result.replace(regex, (match, attrs) => {
        instanceCount++;
        // Skip if already has accessible name
        if (attrs.includes('aria-label') || attrs.includes('aria-labelledby')) {
          return match;
        }
        // Add unique aria-label
        const labelMap = {
          'header': 'Header',
          'nav': `Navigation ${instanceCount}`,
          'main': 'Main Content',
          'aside': `Sidebar ${instanceCount}`,
          'footer': `Footer ${instanceCount}`,
          'section': `Section ${instanceCount}`,
          'article': `Article ${instanceCount}`
        };
        const label = labelMap[lm] || `${lm} ${instanceCount}`;
        return `<${lm}${attrs} aria-label="${label}">`;
      });
    }
  });
  
  return result;
}

/**
 * REACT_036: Fix fake link issue
 * Replaces <a href="#"> or similar hash-only links with proper <button> elements.
 * @param {string} html - The HTML string to process
 * @returns {string} HTML with fake links replaced
 */
export function fixFakeLinkIssue(html) {
  if (typeof html !== 'string') return html;
  
  // Replace hash-only links with buttons
  return html.replace(/<a([^>]*)href=["']#["'][^>]*>(.*?)<\/a>/gi, (match, attrs, content) => {
    // Extract attributes we want to preserve
    const idMatch = attrs.match(/id=["']([^"']*)["']/);
    const classMatch = attrs.match(/class=["']([^"']*)["']/);
    const dataAttrs = attrs.match(/data-[^=]+=["'][^"']*["']/g) || [];
    
    let buttonAttrs = '';
    if (idMatch) buttonAttrs += ` id="${idMatch[1]}"`;
    if (classMatch) buttonAttrs += ` class="${classMatch[1]}"`;
    dataAttrs.forEach(attr => {
      buttonAttrs += ` ${attr}`;
    });
    
    return `<button${buttonAttrs}>${content}</button>`;
  });
}

/**
 * Export functions for testing and module usage
 * @module accessibilityFixes
 */
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    addLangAttribute: addLangAttribute,
    fixTableStructureIssues: fixTableStructureIssues,
    addMainLandmark: addMainLandmark,
    addSvgAccessibleNames: addSvgAccessibleNames,
    ensureUniqueLandmarks: ensureUniqueLandmarks,
    fixFakeLinkIssue: fixFakeLinkIssue
  };
}
```