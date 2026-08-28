// Implementation of accessibility improvements
//------ BEGIN ORIGINAL CODE (unchanged)------

/**
 * Adds lang attribute to HTML element if missing
 * @param {string} html - The HTML string to process
 * @param {string} lang - The language code (e.g., 'en')
 * @returns {string} - Updated HTML with lang attribute
 */
export function addLangToHtml(html, lang = 'en') {
  if (typeof html !== 'string') return html;
  
  const langRegex = /<html[^>]*lang=["'][^"']*["'][^>]*>/i;
  if (langRegex.test(html)) {
    return html;
  }
  
  return html.replace(/<html([^>]*)>/i, `<html$1 lang="${lang}">`);
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
  
  // Ensure proper thead/tbody structure
  result = result.replace(/<tr\b([^>]*)>/gi, (match, attrs) => {
    // Check if tbody already exists before this tr
    const trIndex = result.indexOf(match);
    const beforeTr = result.substring(0, trIndex);
    if (beforeTr && beforeTr.includes('<tbody>') && beforeTr.includes('</tbody>')) {
      return `<tbody>${match}`;
    }
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
        result = result.replace(table, table.replace(/(<table[^>]*>)([\s\S]*)(<\/table>)/i, '$1<tbody>$2</tbody>$3'));
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
    const wrappedContent = `<main>${bodyContent}</main>`;
    return html.replace(bodyMatch[0], `<body${bodyAttrs}>${wrappedContent}</body>`);
  }
  
  return html;
}

/**
 * Adds landmark roles to sections missing them
 * @param {string} html - The HTML string to process
 * @returns {string} - Updated HTML with landmark roles
 */
export function addLandmarkRoles(html) {
  let updated = html;
  
  // Add main landmark if missing (from addMainLandmark logic)
  updated = addMainLandmark(updated);
  
  // Add role="banner" to header if not already present
  if (/<header[^>]*>/i.test(updated) && !/<header[^>]*role=["']banner["'][^>]*>/i.test(updated)) {
    updated = updated.replace(/<header([^>]*)>/i, '<header$1 role="banner">');
  }
  
  // Add role="main" to main element if not already present