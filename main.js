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
    if (attrs && attrs.includes('scope=')) {
      return match;
    }
    return `<th${attrs} scope="col">`;
  });
  
  // Ensure tables have associated caption or summary
  result = result.replace(/<table([^>]*)>/gi, (match, attrs) => {
    if (attrs && (attrs.includes('summary=') || attrs.includes('caption'))) {
      return match;
    }
    // Add summary attribute for screen readers
    return `<table${attrs} summary="Data table">`;
  });
  
  // Ensure proper thead/tbody structure
  result = result.replace(/(<tr[^>]*>)/gi, (match) => {
    // Check if tbody already exists before this tr
    const trIndex = result.indexOf(match);
    const beforeTr = result.substring(0, trIndex);
    if (beforeTr && !/<tbody/i.test(beforeTr.substring(beforeTr.lastIndexOf('<table'))) && !beforeTr.endsWith('</thead>')) {
      return `<tbody>${match}`;
    }
    return match;
  });
  
  // Close tbody tags that aren't properly closed
  const tableRegex = /<table[^>]*>[\s\S]*?<\/table>/gi;
  const tableMatches = result.match(tableRegex) || [];
  tableMatches.forEach(table => {
    const hasThead = /<thead/i.test(table);
    const hasTbody = /<tbody/i.test(table);
    const hasTfoot = /<tfoot/i.test(table);
    
    if (hasThead || hasTbody || hasTfoot) {
      // Ensure proper structure - tbody should wrap data rows
      if (hasTbody && !/<tbody[\s\S]*<\/tbody>/i.test(table)) {
        result = result.replace(table, (t) => {
          const openMatch = t.match(/<table([^>]*)>/i);
          const theadMatch = t.match(/<thead[\s\S]*?<\/thead>/i);
          const tfootMatch = t.match(/<tfoot[\s\S]*?<\/tfoot>/i);
          
          const openTag = openMatch ? openMatch[0] : '<table>';
          const theadContent = theadMatch ? theadMatch[0] : '';
          const tfootContent = tfootMatch ? tfootMatch[0] : '';
          
          const trContent = t.replace(/<table[^>]*>/i, '').replace(/<\/table>/i, '').replace(/<thead[\s\S]*?<\/thead>/i, '').replace(/<tfoot[\s\S]*?<\/tfoot>/i, '').replace(/<tbody[^>]*>/gi, '').replace(/<\/tbody>/gi, '');
          
          return `${openTag}${theadContent}<tbody>${trContent}</tbody>${tfootContent}</table>`;
        });
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
  if (/<main\b/i.test(html)) {
    return html;
  }
  
  // Try to match body content
  const bodyMatch = html.match(/<body([^>]*)>([\s\S]*)<\/body>/i);
  if (bodyMatch) {
    const bodyAttrs = bodyMatch[1];
    const bodyContent = bodyMatch[2];
    const wrappedContent = `<main${bodyAttrs}>${bodyContent}</main>`;
    return html.replace(bodyMatch[0], wrappedContent);
  }
  
  return html;
}

/**