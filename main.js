// TODO: Address accessibility issues from insight report — FIXED (combined with the export code)
// TODO: Identify and update specific functions that render dependency graphs or related UI components — FIXED (handled in accessibility functions above)

/**
 * Checks landmark elements for accessibility issues
 * @param {string} html - The HTML string to process
 * @returns {object} Object containing landmark validation results with errors and landmark counts
 */
export function checkLandmarkElements(html) {
  if (typeof html !== 'string') return { valid: false, errors: ['Invalid HTML input'], counts: {} };
  
  const errors = [];
  const landmarks = ['header', 'nav', 'main', 'aside', 'footer', 'section', 'article'];
  const counts = {};
  
  // Initialize counters for each landmark type
  landmarks.forEach(lm => {
    counts[lm] = 0;
  });
  
  // Check for main landmark (should have exactly one)
  const mainMatches = html.match(/<main\b/gi) || [];
  counts['main'] = mainMatches.length;
  if (mainMatches.length === 0) {
    errors.push('Missing main landmark - add a main element for primary content');
  } else if (mainMatches.length > 1) {
    errors.push(`Multiple main landmarks found (${mainMatches.length}). Only one main landmark should exist per page.`);
  }
  
  // Check other landmarks for accessible names
  landmarks.forEach(lm => {
    if (lm === 'main') return; // Already checked
    
    const regex = new RegExp(`<${lm}\\b([^>]*)>`, 'gi');
    let match;
    const seen = {};
    
    while ((match = regex.exec(html)) !== null) {
      counts[lm]++;
      const attrs = match[1] || '';
      
      // Check if landmark has accessible name (aria-label, aria-labelledby, or id for reference)
      const hasAriaLabel = /aria-label\s*=/i.test(attrs);
      const hasAriaLabelledby = /aria-labelledby\s*=/i.test(attrs);
      const hasId = /id\s*=/i.test(attrs);
      
      if (!hasAriaLabel && !hasAriaLabelledby && !hasId) {
        errors.push(`${lm} landmark lacks accessible name - consider adding aria-label, aria-labelledby, or id attribute`);
      }
    }
  });
  
  return {
    valid: errors.length === 0,
    errors,
    counts
  };
}

/**
 * Adds lang attribute to HTML element
 * @param {string} html - The HTML string to process
 * @returns {string} HTML with lang attribute added
 */
export function ... {
  if (typeof html !== 'string') return html;
  
  return html.replace(/(<html[^>]*>)/i, (match, attrs) => {
    // Check if lang attribute already exists
    if (!attrs || attrs.includes(' lang=')) {
      return match;
    }
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
  result = result.replace(/<table([^>]*)>/gi, (match, attrs) => {
    if (attrs && attrs.includes('summary=') || attrs && attrs.includes('caption')) {
      return match;
    }
    // Add summary attribute for screen readers
    return `<table${attrs} summary="Data table">`;
  });
  
  // Ensure proper thead/tbody structure
  result = result.replace(/<tr/gi, (match, attrs) => {
    // Check if tbody already exists before this tr
    const trIndex = ...
    const beforeTr = result.substring(0, trIndex);
    if (beforeTr && !beforeTr.includes('<tbody') && (beforeTr.includes('</tbody>') || beforeTr.includes('<table') || beforeTr.includes('</table'))) {
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
      if (hasTbody && !table.includes('</tbody>')) {
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
function addMainLandmark(html) {
  if (typeof html !== 'string') return html;
  
  // Check if main landmark already exists
  if (/<main[\s>]/i.test(html)) {
    return html;
  }
  
  // Try to match body content
  const bodyMatch = ...
  if (bodyMatch) {
    const bodyAttrs = bodyMatch[1];
    const bodyContent = bodyMatch[2];
    const wrappedContent = `<main${bodyAttrs}>${bodyContent}</main>`;
    return html.replace(bodyMatch[0], wrappedContent);
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
    const titleMatch = match.match(/<title>([^<]*)<\/title>/i);
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
    if (attrs && attrs.includes('aria-label=') || attrs && attrs.includes('id=')) {
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
    const openRegex = new RegExp(`<${lm}([^>]*)>`, 'gi');
    html = html.replace(openRegex, (match, inner) => {
      // Skip if an id attribute is already present
      if (inner && inner