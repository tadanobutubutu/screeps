// main.js
// TODO: Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element
// - REACT_017: Add landmark roles and fix landmark issues
// - REACT_025: Add other accessibility changes as per the insight report (ensure unique landmarks)
// - REACT_027: Add scope="col" or scope="row" to <th> elements (already implemented)
// - REACT_036: Fix 1 fake link issue
// - REACT_041: Add accessible names to 2 SVGs

const fs = require('fs');
const path = require('path');

function generateHTML() {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Quality & Metrics Reports</title>
</head>
<body>
    <a href="#main-content" class="skip-link">Skip to main content</a>
    
    <header>
        <h1>Repository Dashboard</h1>
    </header>
    
    <main id="main-content">
        <div class="container">
            <h2>Quality & Metrics Reports</h2>
            <p>
                This repository is fully optimized with automated tools. Explore the generated
                reports below:
            </p>
            <div class="links" role="navigation" aria-label="Report links">
                <a href="/plato">Plato Code Complexity Report</a>
                <a href="/dependency-graph">Dependency Graph</a>
            </div>
        </div>
    
        <section aria-labelledby="metrics-heading">
            <h2 id="metrics-heading">Metrics Data</h2>
            <table id="table-rotated">
                <thead>
                    <tr>
                        <th scope="col">Metric</th>
                        <th scope="col">Value</th>
                    </tr>
                </thead>
                <tbody>
                    <!-- table content -->
                </tbody>
            </table>
        </section>
    </main>
    
    <footer>
        <p>&copy; 2024</p>
    </footer>
</body>
</html>`;
}

/**
 * Adds lang attribute to HTML element if missing
 * @param {string} html - The HTML string to process
 * @param {string} lang - The language code (e.g., 'en')
 * @returns {string} - Updated HTML with lang attribute
 */
function addLangToHtml(html, lang = 'en') {
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
function fixTableStructureIssues(html) {
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
function addMainLandmark(html) {
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
function addLandmarkRoles(html) {
  let updated = html;
  
  // Add main landmark if missing (from addMainLandmark logic)
  updated = addMainLandmark(updated);
  
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
 * Adds accessible name to SVG elements
 * @param {string} html - The HTML string to process
 * @returns {string} - Updated HTML with SVG accessible names
 */
function addSvgAccessibleNames(html) {
  let updated = html;
  let svgCounter = 0;
  
  return updated.replace(/<svg\b([^>]*)>/gi, (match, attrs) => {
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
      return `<svg${attrs} role="img" aria-labelledby="${idMatch[1]}-title">`;
    }
    
    // Add inline title for accessibility
    const titleId = `svg-title-${++svgCounter}`;
    return `<svg${attrs} role="img" aria-labelledby="${titleId}"><title id="${titleId}">${label}</title>`;
  });
}

/**
 * Ensures unique landmark roles in the HTML
 * @param {string} html - The HTML string to process
 * @returns {string} - Updated HTML with unique landmarks
 */
function ensureUniqueLandmarks(html) {
  let updated = html;
  
  // First, ensure only one <main> landmark exists.
  // Convert subsequent <main> elements to <section> with aria-label.
  let mainSeen = false;
  updated = updated.replace(/<main\b([^>]*)>/gi, (match, attrs) => {
    if (!mainSeen) {
      mainSeen = true;
      return match;
    }
    // Replace additional <main> tags with <section> while preserving any attributes
    const safeAttrs = attrs || '';
    // Avoid duplicating an aria-label if one already exists
    if (safeAttrs.includes('aria-label=') || safeAttrs.includes("aria-label='")) {
      return match.replace(/<main\b/, '<section');
    }
    return `<section${safeAttrs} aria-label="Content section">`;
  });
  
  // Also update closing tags for converted <main> elements
  // Count occurrences of <main> opening tags in the original-like state and
  // match closing tags. Since we replaced extra <main> with <section>, we must
  // replace the corresponding extra </main> closing tags with </section>.
  const mainOpenCount = (updated.match(/<main\b/gi) || []).length;
  const mainCloseCount = (updated.match(/<\/main>/gi) || []).length;
  if (mainCloseCount > mainOpenCount) {
    const extras = mainCloseCount - mainOpenCount;
    let replaced = 0;
    updated = updated.replace(/<\/main>/gi, (match) => {
      if (replaced < extras) {
        replaced += 1;
        return '</section>';
      }
      return match;
    });
  }
  
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
function fixFakeLinks(html) {
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
function processAccessibility(html, options = {}) {
  let result = html;
  
  result = addLangToHtml(result, options.lang || 'en');
  result = addLandmarkRoles(result);
  result = addSvgAccessibleNames(result);
  result = ensureUniqueLandmarks(result);
  result = fixFakeLinks(result);
  
  return result;
}

function addressAccessibilityIssues() {
    // Function implementation goes here
}

const VERSION = '1.0.0';

module.exports = {
  generateHTML,
  addLangToHtml,
  addLandmarkRoles,
  addSvgAccessibleNames,
  ensureUniqueLandmarks,
  fixFakeLinks,
  fixTableStructureIssues,
  processAccessibility,
  addressAccessibilityIssues,
  VERSION
};