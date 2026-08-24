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
  result = result.replace(/(<table([^>]*)>)(?!.*<caption)/gi, (match, openTag, attrs) => {
    if (attrs.includes('summary=')) {
      return openTag;
    }
    // Add summary attribute for screen readers
    return `<table${attrs} summary="Data table">`;
  });
  
  // Ensure proper thead/tbody structure
  result = result.replace(/(<tr[^>]*>)/gi, (match, openTag) => {
    // Check if tbody already exists before this tr
    const trIndex = result.indexOf(openTag);
    const beforeTr = result.substring(0, trIndex);
    if (!beforeTr.includes('<tbody>') && !beforeTr.match(/<table[^>]*>\s*<thead/)) {
      return `<tbody>${match}`;
    }
    return match;
  });
  
  // Close tbody tags that aren't properly closed
  const tableMatches = result.match(/<table[^>]*>[\s\S]*?<\/table>/gi) || [];
  tableMatches.forEach(table => {
    const hasThead = /<thead/.test(table);
    const hasTbody = /<tbody/.test(table);
    const hasTfoot = /<tfoot/.test(table);
    
    if (hasThead || hasTbody || hasTfoot) {
      // Ensure proper structure - tbody should wrap data rows
      if (hasTbody && !/<tbody>[\s\S]*<\/tbody>/.test(table)) {
        result = result.replace(table, table.replace(/(<table[^>]*>)([\s\S]*)(<\/table>)/i, '$1<tbody>$2</tbody></table>'));
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
  const bodyMatch = html.match(/<body[^>]*>([\s\S]*)<\/body>/i);
  if (bodyMatch) {
    const bodyAttrs = bodyMatch[1];
    const bodyContent = bodyMatch[2];
    const wrappedContent = `<main>${bodyContent}</main>`;
    return html.replace(bodyMatch[0], `<body>${wrappedContent}</body>`);
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
    const idMatch = attrs.match(/id="([^"]*)"/);
    if (idMatch) {
      return `<svg${attrs} role="img" aria-labelledby="${idMatch[1]}">`;
    }
    
    // Add inline title for accessibility
    const titleId = `svg-title-${++svgCounter}`;
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
    const regex = new RegExp(`<${lm}(\\s[^>]*)?>`, 'gi');
    const matches = html.match(regex) || [];
    
    html = html.replace(regex, (match, attrs = '') => {
      counters[lm]++;
      const uniqueId = `landmark-${lm}-${counters[lm]}`;
      
      // Check if id already exists
      if (attrs.includes('id=')) {
        return match;
      }
      
      // Add unique id if not present
      return `<${lm} id="${uniqueId}"${attrs}>`;
    });
  });
  
  return html;
}

/**
 * Fixes fake link issues for accessibility
 * Converts elements that look like links but aren't into proper accessible links or buttons
 * @param {string} html - The HTML string to process
 * @returns {string} HTML with fake link issues fixed
 */
export function fixFakeLinkIssue(html) {
  if (typeof html !== 'string') return html;
  
  let result = html;
  
  // Find divs or spans with onclick that act as links
  result = result.replace(/(<(?:div|span)[^>]*onclick=[^>]+>)([^<]*)(<\/div|<\/span)/gi, (match, openTag, content, closeTag) => {
    // Check if it contains an anchor tag or looks like navigation
    if (content.includes('<a ') || content.match(/href=/)) {
      return match;
    }
    
    // Check if this looks like a button/link based on content or class
    const isButtonLike = openTag.includes('class=') && (openTag.includes('button') || openTag.includes('link') || openTag.includes('nav'));
    
    if (isButtonLike) {
      // Convert to proper button
      return openTag.replace(/<(div|span)/i, '<button type="button"') + content + closeTag.replace('div>', 'button>').replace('span>', 'button>');
    }
    
    return match;
  });
  
  // Convert empty anchors to accessible links
  result = result.replace(/<a([^>]*)>\s*<\/a>/gi, (match, attrs) => {
    // Check if it has an href
    if (attrs.includes('href=')) {
      return match;
    }
    // Remove empty anchors or convert to spans
    return `<span${attrs} role="presentation">`;
  });
  
  return result;
}

/**
 * Creates an accessible in-page button
 * @param {string} text - Button text
 * @param {string} onClick - OnClick handler
 * @returns {string} Accessible button HTML
 */
export function createInPageButton(text, onClick) {
  return `<button type="button" onclick="${onClick}" aria-label="${text}">${text}</button>`;
}

/**
 * Creates an accessible link
 * @param {string} href - Link URL
 * @param {string} text - Link text
 * @param {boolean} isExternal - Whether link opens in new tab
 * @returns {string} Accessible link HTML
 */
export function createAccessibleLink(href, text, isExternal = false) {
  const externalAttrs = isExternal ? ' target="_blank" rel="noopener noreferrer"' : '';
  return `<a href="${href}"${externalAttrs}>${text}</a>`;
}

/**
 * Gets the language attribute value
 * @param {string} html - The HTML string to process
 * @returns {string} Language attribute value or 'en' as default
 */
export function getLangAttribute(html) {
  if (typeof html !== 'string') return 'en';
  
  const langMatch = html.match(/<html[^>]*lang=["']([^"']*)["']/i);
  return langMatch ? langMatch[1] : 'en';
}

/**
 * Gets the full language attribute with country code
 * @param {string} html - The HTML string to process
 * @returns {string} Full language attribute (e.g., 'en-US')
 */
export function getFullLangAttribute(html) {
  return getLangAttribute(html);
}

/**
 * Validates table accessibility
 * @param {string} html - The HTML string to process
 * @returns {Object} Validation result with issues array
 */
export function validateTableAccessibility(html) {
  const issues = [];
  
  if (typeof html !== 'string') {
    return { valid: true, issues: [] };
  }
  
  // Check for tables without headers
  const tables = html.match(/<table[^>]*>[\s\S]*?<\/table>/gi) || [];
  tables.forEach((table, index) => {
    if (!/<th/i.test(table)) {
      issues.push({
        type: 'table',
        message: `Table ${index + 1} lacks proper table headers`,
        severity: 'warning'
      });
    }
    
    if (!/<caption/i.test(table) && !/summary=/i.test(table)) {
      issues.push({
        type: 'table',
        message: `Table ${index + 1} lacks caption or summary`,
        severity: 'warning'
      });
    }
  });
  
  return { valid: issues.length === 0, issues };
}

/**
 * Validates table structure
 * @param {string} html - The HTML string to process
 * @returns {Object} Validation result with issues array
 */
export function validateTableStructure(html) {
  const issues = [];
  
  if (typeof html !== 'string') {
    return { valid: true, issues: [] };
  }
  
  // Check for proper thead/tbody structure
  const tables = html.match(/<table[^>]*>[\s\S]*?<\/table>/gi) || [];
  tables.forEach((table, index) => {
    const hasThead = /<thead/.test(table);
    const hasTbody = /<tbody/.test(table);
    const hasRows = /<