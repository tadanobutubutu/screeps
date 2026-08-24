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
  result = result.replace(/<table([^>]*)>/gi, (match, attrs) => {
    if (attrs.includes('summary=')) {
      return match;
    }
    // Add summary attribute for screen readers
    return `<table${attrs} summary="Data table">`;
  });
  
  // Ensure proper thead/tbody structure
  result = result.replace(/(<tr[^>]*>)/gi, (match) => {
    // Check if tbody already exists before this tr
    const beforeTr = result.substring(0, result.indexOf(match));
    if (!beforeTr.includes('<tbody') && beforeTr.includes('<table')) {
      return `<tbody>${match}`;
    }
    return match;
  });
  
  // Close tbody tags that aren't properly closed
  const tableMatches = result.match(/<table[^>]*>[\s\S]*?<\/table>/gi) || [];
  tableMatches.forEach(table => {
    const hasThead = table.includes('<thead');
    const hasTbody = table.includes('<tbody');
    const hasTfoot = table.includes('<tfoot');
    
    if (hasThead || hasTbody || hasTfoot) {
      // Ensure proper structure - tbody should wrap data rows
      if (hasTbody && !table.match(/<tbody>[\s\S]*<\/tbody>/i)) {
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
  if (html.includes('<main') || html.includes('<main ')) {
    return html;
  }
  
  // Wrap content in main landmark
  // Try to match body content
  const bodyMatch = html.match(/<body([^>]*)>([\s\S]*)<\/body>/i);
  if (bodyMatch) {
    const bodyAttrs = bodyMatch[1];
    const bodyContent = bodyMatch[2];
    const wrappedContent = `<main${bodyAttrs}>${bodyContent}</main>`;
    return html.replace(/<body([^>]*)>[\s\S]*<\/body>/i, wrappedContent);
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
    const existingLabel = attrs.match(/aria-label=/) || attrs.match(/aria-labelledby=/);
    
    if (existingLabel) {
      return match;
    }
    
    // Extract title if present
    const titleMatch = match.match(/<title[^>]*>([^<]*)<\/title>/i);
    let label = titleMatch ? titleMatch[1] : `SVG image ${++svgCounter}`;
    
    // Check for id to reference
    const idMatch = attrs.match(/id=["']([^"']*)["']/);
    if (idMatch) {
      return `<svg${attrs} role="img" aria-label="${label}">`;
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
    counters[lm] = 0;
  });
  
  let result = html;
  
  // Process each landmark type
  landmarks.forEach(lm => {
    const regex = new RegExp(`<${lm}([^>]*)>`, 'gi');
    result = result.replace(regex, (match, attrs) => {
      counters[lm]++;
      const idMatch = attrs.match(/id=["']([^"']*)["']/);
      
      if (idMatch) {
        // Already has an ID, check if it's unique
        const id = idMatch[1];
        const idCount = (result.match(new RegExp(`id=["']${id}["']`, 'gi')) || []).length;
        if (idCount > 1) {
          // Duplicate ID, make it unique
          const newId = `${id}-${counters[lm]}`;
          return `<${lm}${attrs.replace(idMatch[0], `id="${newId}"")}>`;
        }
        return match;
      }
      
      // Add unique ID if this landmark appears more than once
      const occurrences = (html.match(new RegExp(`<${lm}[^>]*>`, 'gi')) || []).length;
      if (occurrences > 1) {
        return `<${lm}${attrs} id="${lm}-${counters[lm]}">`;
      }
      
      return match;
    });
  });
  
  return result;
}

/**
 * Fixes fake link issues for accessibility
 * Converts divs or spans with onclick that look like links into proper accessible links or buttons
 * @param {string} html - The HTML string to process
 * @returns {string} HTML with fake link issues fixed
 */
export function fixFakeLinkIssue(html) {
  if (typeof html !== 'string') return html;
  
  let result = html;
  
  // Find elements that look like links but are actually divs/spans with onclick
  const fakeLinkRegex = /<(div|span)([^>]*)onclick([^>]*)>([^<]*)<\/div>/gi;
  
  result = result.replace(fakeLinkRegex, (match, tag, before, after, content) => {
    // Check if it looks like a link (has href style or cursor pointer)
    const hasLinkStyle = before.includes('cursor:pointer') || before.includes('text-decoration:underline') || before.includes('color:');
    
    if (hasLinkStyle) {
      // Convert to a proper button element for better accessibility
      const idMatch = (before + after).match(/id=["']([^"']*)["']/);
      const idAttr = idMatch ? ` id="${idMatch[1]}"` : '';
      return `<button${idAttr} type="button" class="fake-link-button">${content}</button>`;
    }
    return match;
  });
  
  // Convert divs with href attribute to actual anchor tags
  const divWithHrefRegex = /<div([^>]*)href=["']([^"']*)["']([^>]*)>([^<]*)<\/div>/gi;
  result = result.replace(divWithHrefRegex, (match, before, href, after, content) => {
    const combinedAttrs = before + after;
    const idMatch = combinedAttrs.match(/id=["']([^"']*)["']/);
    const classMatch = combinedAttrs.match(/class=["']([^"']*)["']/);
    
    let idAttr = idMatch ? ` id="${idMatch[1]}"` : '';
    let classAttr = classMatch ? ` class="${classMatch[1]}"` : '';
    
    return `<a${idAttr}${classAttr} href="${href}">${content}</a>`;
  });
  
  return result;
}