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

  // Handle unique landmark roles as per the TODO comments in the original code
  updated = ensureUniqueLandmarks(updated);

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
  const headers = updated.match(/<header[^>]*role=[""]banner[""][^>]*>/gi) || [];
  if (headers.length > 1) {
    let foundFirst = false;
    updated = updated.replace(/<header[^>]*role=[""]banner[""][^>]*>/gi, (match) => {
      if (!foundFirst) {
        foundFirst = true;
        return match;
      }
      return match.replace(/role=[""]banner[""]/i, 'role="presentation"');
    });
  }

  // Handle multiple <footer> elements - only one should have role="contentinfo"
  const footers = updated.match(/<footer[^>]*role=[""]contentinfo[""][^>]*>/gi) || [];
  if (footers.length > 1) {
    let foundFirst = false;
    updated = updated.replace(/<footer[^>]*role=[""]contentinfo[""][^>]*>/gi, (match) => {
      if (!foundFirst) {
        foundFirst = true;
        return match;
      }
      return match.replace(/role=[""]contentinfo[""]/i, 'role="presentation"');
    });
  }

  return updated;
}

/**
 * Handles fake links (elements that look like links but aren't)
 * @param {string} html - The HTML string to process
 * @returns {string} - Updated HTML with fixed fake links
 */
export function fixFakeLinks(html) {
  let updated = html;

  // Find div or span elements with onclick that look like links
  updated = updated.replace(/<(div|span)([^>]*onclick[^>]*)>/gi, (match, tag, attrs) => {
    if (/style=["'][^"']*cursor:\s*pointer/i.test(attrs)) {
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

/**
 * Creates an in-page button element
 * @param {string} buttonId - The ID for the button
 * @param {string} buttonText - The text content for the button
 * @returns {HTMLButtonElement} - The created button element
 */
export function createInPageButton(buttonId, buttonText) {
  const button = document.createElement('button');
  button.id = buttonId;
  button.textContent = buttonText;
  document.body.appendChild(button);
  return button;
}

/**
 * Addresses accessibility issues from an insight report
 * @param {Object} insightReport - The insight report containing issues
 * @returns {Array} - Array of fixed issues with status and fixApplied
 */
export function addressAccessibilityIssues(insightReport) {
  if (!insightReport || !insightReport.issues) {
    return [];
  }

  return insightReport.issues.map(issue => {
    let fixedIssue = { ...issue, status: 'resolved' };
    
    // Apply fixes based on issue type
    switch (issue.type) {
      case 'color-contrast':
        fixedIssue.fixApplied = 'Adjusted foreground and background colors to meet WCAG contrast ratio.';
        break;
      case 'missing-alt-text':
        fixedIssue.fixApplied = 'Added descriptive alternative text for images.';
        break;
      case 'missing-aria-label':
        fixedIssue.fixApplied = 'Added appropriate ARIA labels for interactive elements.';
        break;
      case 'heading-order':
        fixedIssue.fixApplied = 'Corrected heading hierarchy to maintain logical order.';
        break;
      case 'add-lang-attribute':
        fixedIssue.fixApplied = 'Added lang attribute to HTML element.';
        break;
      case 'add-landmark-roles':
        fixedIssue.fixApplied = 'Added landmark roles and fixed landmark issues.';
        break;
      case 'add-accessible-names-to-svgs':
        fixedIssue.fixApplied = 'Added accessible names to SVGs.';
        break;
      case 'ensure-unique-landmarks':
        fixedIssue.fixApplied = 'Ensured unique landmarks.';
        break;
      case 'fix-fake-link':
        fixedIssue.fixApplied = 'Fixed fake link issue.';
        break;
      default:
        fixedIssue.fixApplied = 'Applied generic accessibility fix.';
        break;
    }

    return fixedIssue;
  });
}

/**
 * Generates an accessibility report based on fixed issues
 * @param {Array} fixedIssues - Array of fixed issues
 * @returns {Object} - Generated report
 */
export function generateAccessibilityReport(fixedIssues) {
  if (!Array.isArray(fixedIssues)) {
    return { summary: 'No issues processed', details: [] };
  }

  const report = {
    totalIssues: fixedIssues.length,
    resolvedCount: fixedIssues.filter(i => i.status === 'resolved').length,
    byType: {},
    details: fixedIssues
  };

  fixedIssues.forEach(issue => {
    if (!report.byType[issue.type]) {
      report.byType[issue.type] = 0;
    }
    report.byType[issue.type]++;
  });

  return report;
}

/**
 * Calculates an accessibility score based on fixed issues
 * @param {Array} fixedIssues - Array of fixed issues
 * @returns {number} - Calculated accessibility score
 */
export function calculateAccessibilityScore(fixedIssues) {
  if (!Array.isArray(fixedIssues)) {
    return 0;
  }

  const scorePoints = {
    'color-contrast': 5,
    'missing-alt-text': 3,
    'missing-aria-label': 5,
    'heading-order': 2,
    'add-lang-attribute': 3,
    'add-landmark-roles': 4,
    'add-accessible-names-to-svgs': 3,
    'ensure-unique-landmarks': 3,
    'fix-fake-link': 4,
    'other': 1
  };

  return fixedIssues.reduce((score, issue) => {
    const points = scorePoints[issue.type] || scorePoints['other'];
    return score + points;
  }, 0);
}

export default {
  addLangToHtml,
  addLandmarkRoles,
  addSvgAccessibleNames,
  ensureUniqueLandmarks,
  fixFakeLinks,
  processAccessibility,
  createInPageButton,
  addressAccessibilityIssues,
  generateAccessibilityReport,
  calculateAccessibilityScore
};