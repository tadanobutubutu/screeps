const { functionName } = require('./util');

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

/**
 * Checks the landmark structure of the HTML
 * @param {string} html - The HTML string to check
 * @returns {Object} Object containing landmark analysis
 */
function checkLandmarkStructure(html) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');

  const mainLandmark = doc.querySelector('main, [role="main"]');
  const landmarks = doc.querySelectorAll('header, nav, main, aside, footer, [role="banner"], [role="navigation"], [role="main"], [role="complementary"], [role="contentinfo"]');

  return {
    hasMainLandmark: !!mainLandmark,
    landmarkCount: landmarks.length,
    landmarks: Array.from(landmarks).map(el => el.tagName.toLowerCase() + (el.getAttribute('role') ? `[role="${el.getAttribute('role')}"]` : ''))
  };
}

/**
 * Adds lang attribute to HTML element
 * @param {string} html - The HTML string to process
 * @returns {string} HTML with lang attribute added
 */
function addLangAttribute(html) {
  if (typeof html !== 'string') return html;

  return html.replace(/<html([^>]*)>/i, (match, attrs) => {
    // Check if lang attribute already exists
    if (attrs && /lang\s*=/i.test(attrs)) {
      return match;
    }
    // Add lang attribute with 'en' as default
    return `<html${attrs ? ' ' + attrs : ''} lang="en">`;
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

  // Ensure scope="col" on th elements that lack scope
  result = result.replace(/<th([^>]*?)>/gi, (match, attrs) => {
    if (attrs && /scope\s*=/i.test(attrs)) {
      return match;
    }
    return `<th${attrs ? ' ' + attrs : ''} scope="col">`;
  });

  // Ensure tables have a summary or a caption
  result = result.replace(/<table([^>]*)>/gi, (match, attrs) => {
    // Check if summary attribute exists or a caption is already present later
    if (attrs && /summary\s*=/i.test(attrs)) {
      return match;
    }
    // Check if table already contains a caption element
    const tableContent = match + result.substring(result.indexOf(match) + match.length);
    if (/<caption\b/i.test(tableContent)) {
      return match;
    }
    // Add summary attribute for screen readers
    return `<table${attrs ? ' ' + attrs : ''} summary="Data table">`;
  });

  // Ensure tbody is present for data rows
  result = result.replace(/(<table[^>]*>)([\s\S]*?)(<tr\b)/gi, (match, tableTag, between, trTag) => {
    // If there's already a tbody, don't add another
    if (/<tbody\b/i.test(between) || /<thead\b/i.test(between) || /<tfoot\b/i.test(between)) {
      return match;
    }
    return `${tableTag}${between}<tbody>${trTag}`;
  });

  // Close tbody tags that aren't properly closed
  const tableMatches = result.match(/<table[\s\S]*?<\/table>/gi) || [];
  tableMatches.forEach(table => {
    const hasThead = /<thead/i.test(table);
    const hasTbody = /<tbody/i.test(table);
    const hasTfoot = /<tfoot/i.test(table);

    if (hasThead || hasTbody || hasTfoot) {
      // Ensure proper closing if missing
      const openTbody = (table.match(/<tbody/gi) || []).length;
      const closeTbody = (table.match(/<\/tbody>/gi) || []).length;
      if (openTbody > closeTbody) {
        const extra = openTbody - closeTbody;
        result = result.replace(table, table + '</tbody>'.repeat(extra));
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
  if (/<main\b/i.test(html) || /<div[^>]*role=["']main["']/i.test(html)) {
    return html;
  }

  // Try to match body content
  const bodyMatch = html.match(/<body([^>]*)>([\s\S]*?)<\/body>/i);
  if (bodyMatch) {
    const bodyAttrs = bodyMatch[1];
    const bodyContent = bodyMatch[2];
    const wrappedContent = `<main>${bodyContent}</main>`;
    return html.replace(/<body([^>]*)>([\s\S]*?)<\/body>/i, `<body${bodyAttrs}>${wrappedContent}</body>`);
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
    const existingLabel = attrs && /aria-label\s*=|aria-labelledby\s*=/i.test(attrs);
    if (existingLabel) {
      return match;
    }

    // Extract title if present
    const titleMatch = match.match(/<title[^>]*>([^<]*)<\/title>/i);
    let label = titleMatch ? titleMatch[1] : `SVG image ${++svgCounter}`;

    // Check for id to reference
    const idMatch = match.match(/\bid\s*=\s*["']([^"']+)["']/i);
    if (idMatch) {
      // Use existing id for aria-labelledby
      return `<svg${attrs} role="img" aria-labelledby="${idMatch[1]}">`;
    }

    // Add inline title for accessibility
    const titleId = `svg-title-${svgCounter || (++svgCounter)}`;
    return `<svg${attrs} role="img" aria-labelledby="${titleId}"><title id="${titleId}">${label}</title>`;
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

  // Convert duplicate <main> elements to <section> with aria-label
  let mainSeen = false;
  html = html.replace(/<main([^>]*)>/gi, (match, attrs) => {
    if (!mainSeen) {
      mainSeen = true;
      return match;
    }
    // Preserve any existing attributes, add aria-label if not present
    const safeAttrs = attrs || '';
    if (safeAttrs.includes('aria-label=') || safeAttrs.includes('aria-labelledby=')) {
      return `<section${safeAttrs}>`;
    }
    return `<section${safeAttrs} aria-label="Content section">`;
  });

  // Update corresponding closing </main> tags to </section> for the extras
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

  // Assign unique IDs to landmark elements that don't have one
  const landmarks = ['header', 'nav', 'aside', 'footer', 'section', 'article'];
  landmarks.forEach(lm => {
    const regex = new RegExp(`<${lm}([^>]*)>`, 'gi');
    const seen = {};
    html = html.replace(regex, (match, inner) => {
      // Skip if an id attribute is already present
      if (inner && /id\s*=/i.test(inner)) {
        return match;
      }
      seen[lm] = (seen[lm] || 0) + 1;
      const id = `${lm}-${seen[lm]}`;
      return `<${lm} id="${id}"${inner ? ' ' + inner : ''}>`;
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

  return html.replace(/<a([^>]*)>/gi, (match, attrs) => {
    // If it has a valid href attribute (including empty), leave it
    if (attrs && /href\s*=/i.test(attrs)) {
      return match;
    }
    // Add href="#" placeholder
    return `<a${attrs ? ' ' + attrs : ''} href="#">`;
  });
}

// Update module.exports to include all accessibility functions
module.exports = {
  checkLandmarkStructure,
  addLangAttribute,
  fixTableStructureIssues,
  addMainLandmark,
  addSvgAccessibleNames,
  ensureUniqueLandmarks,
  fixFakeLinkIssue,
  functionName // Preserve existing export
};