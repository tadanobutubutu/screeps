// TODO: Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element
// - REACT_017: Add landmark roles and fix landmark issues
// - REACT_041: Add accessible names to 2 SVGs
// - REACT_025: Ensure unique landmarks (2 issues)
// - REACT_036: Fix 1 fake link issue
// - REACT_027: Add scope="col" or scope="row" to <th> elements (already implemented)
// (Added functions for REACT_017 and new REACT_025)

/**
 * Adds lang attribute to HTML element if missing
 * @param {string} html - The HTML string to process
 * @param {string} lang - The language code (e.g., 'en')
 * @returns {string} - Updated HTML with lang attribute
 */
export function addLangToHtml(html, lang = 'en') {
  const langRegex = /<html[^>]*lang=["'][^"']*["'][^>]*>/i;
  if (langRegex.test(html)) {
    return html;
  }
  return html.replace(/<html([^>]*)>/i, `<html$1 lang="${lang}">`);
}

/**
 * Adds landmark roles to sections missing them
 * @param {string} html - The HTML string to process
 * @returns {string} - Updated HTML with landmark roles
 */
export function addLandmarkRoles(html) {
  let updated = html;
  
  // Add role="banner" to header if not already present
  if (/<header[^>]*>/i.test(updated) && !/<header[^>]*role=["']banner["'][^>]*>/i.test(updated)) {
    updated = updated.replace(/<header([^>]*)>/i, '<header$1 role="banner">');
  }
  
  // Add role="main" to main element if not already present
  if (/<main[^>]*>/i.test(updated) && !/<main[^>]*role=["']main["'][^>]*>/i.test(updated)) {
    updated = updated.replace(/<main([^>]*)>/i, '<main$1 role="main">');
  }
  
  // Add role="contentinfo" to footer if not already present
  if (/<footer[^>]*>/i.test(updated) && !/<footer[^>]*role=["']contentinfo["'][^>]*>/i.test(updated)) {
    updated = updated.replace(/<footer([^>]*)>/i, '<footer$1 role="contentinfo">');
  }
  
  // Add role="navigation" to nav elements if not already present
  if (/<nav[^>]*>/i.test(updated) && !/<nav[^>]*role=["']navigation["'][^>]*>/i.test(updated)) {
    updated = updated.replace(/<nav([^>]*)>/i, '<nav$1 role="navigation">');
  }
  
  return updated;
}

/**
 * Adds accessible names to SVG elements
 * @param {string} html - The HTML string to process
 * @returns {string} - Updated HTML with SVG accessible names
 */
export function addSvgAccessibleNames(html) {
  let updated = html;
  let svgIndex = 0;
  
  // Replace SVG elements that don't have aria-label or aria-labelledby
  updated = updated.replace(/<svg(?!([^>]*)(aria-label|aria-labelledby)=)([^>]*)>/gi, (match, p1, p2, p3) => {
    const index = svgIndex++;
    return `<svg${p3} aria-label="SVG icon ${index + 1}">`;
  });
  
  return updated;
}

/**
 * Ensures unique landmark roles in the HTML
 * @param {string} html - The HTML string to process
 * @returns {string} - Updated HTML with unique landmarks
 */
export function ensureUniqueLandmarks(html) {
  let updated = html;
  
  // Handle multiple <header> elements - only one should have role="banner"
  const headers = updated.match(/<header[^>]*role=["']banner["'][^>]*>/gi) || [];
  if (headers.length > 1) {
    // Keep only the first header with role="banner", change others to role="presentation"
    let foundFirst = false;
    updated = updated.replace(/<header[^>]*role=["']banner["'][^>]*>/gi, (match) => {
      if (!foundFirst) {
        foundFirst = true;
        return match;
      }
      return match.replace(/role=["']banner["']/i, 'role="presentation"');
    });
  }
  
  // Handle multiple <footer> elements - only one should have role="contentinfo"
  const footers = updated.match(/<footer[^>]*role=["']contentinfo["'][^>]*>/gi) || [];
  if (footers.length > 1) {
    let foundFirst = false;
    updated = updated.replace(/<footer[^>]*role=["']contentinfo["'][^>]*>/gi, (match) => {
      if (!foundFirst) {
        foundFirst = true;
        return match;
      }
      return match.replace(/role=["']contentinfo["']/i, 'role="presentation"');
    });
  }
  
  return updated;
}

/**
 * Fixes fake links (elements that look like links but aren't)
 * @param {string} html - The HTML string to process
 * @returns {string} - Updated HTML with fixed fake links
 */
export function fixFakeLinks(html) {
  let updated = html;
  
  // Find div or span elements with onclick that look like links
  updated = updated.replace(/<(div|span)([^>]*onclick[^>]*)>/gi, (match, tag, attrs) => {
    // Check if it looks like a link (has cursor:pointer or similar styling)
    if (/style=["'][^"']*cursor:\s*pointer/i.test(attrs)) {
      // Convert to proper link or add role="button"
      if (!/role=["']button["']/i.test(attrs)) {
        return `<${tag}${attrs} role="button" tabindex="0">`;
      }
    }
    return match;
  });
  
  return updated;
}

/**
 * Main function to process accessibility fixes
 * @param {string} html - The HTML string to process
 * @param {Object} options - Configuration options
 * @returns {string} - Updated HTML with accessibility fixes
 */
export function processAccessibility(html, options = {}) {
  let result = html;
  
  result = addLangToHtml(result, options.lang || 'en');
  result = addLandmarkRoles(result);
  result = addSvgAccessibleNames(result);
  result = ensureUniqueLandmarks(result);
  result = fixFakeLinks(result);
  
  return result;
}

export default {
  addLangToHtml,
  addLandmarkRoles,
  addSvgAccessibleNames,
  ensureUniqueLandmarks,
  fixFakeLinks,
  processAccessibility
};