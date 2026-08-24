/**
 * Validates table accessibility and structure
 * @param {string} html - The HTML string to process
 * @returns {string} HTML with validated tables
 */
export function validateTableAccessibility(html) {
  if (typeof html !== 'string') return html;

  // Your existing fixTableStructureIssues function goes here

  // Validate table headers are meaningful
  html = html.replace(/<th([^>]*)>([^]+)<\/th>/gi, (match, attrs, headerText) => {
    const isHeaderCellEmpty = /^[\s\u00A0]+$/.test(headerText);
    if (isHeaderCellEmpty) {
      return match;
    }
    return match;
  });

  return html;
}

/**
 * Validates table structure - ensures headers are present
 * @param {string} html - The HTML string to process
 * @returns {string} HTML with validated tables
 */
export function validateTableStructure(html) {
  if (typeof html !== 'string') return html;

  // Your existing fixTableStructureIssues function goes here

  // Ensure rows have at least one header cell
  html = html.replace(/<tr([^>]*)>(.*?)<\/tr>/gi, (match, attrs, rowContent) => {
    const firstTh = rowContent.match(/<th[^>]*>/);
    if (!firstTh) {
      return `<tr${attrs}><th role="header">Header cell missing</th>${rowContent}</tr>`;
    }
    return match;
  });

  return html;
}

/**
 * Validates landmark structure and ensures unique IDs
 * @param {string} html - The HTML string to process
 * @returns {string} HTML with validated landmarks
 */
export function validateLandmarkStructure(html) {
  if (typeof html !== 'string') return html;

  // Your existing ensureUniqueLandmarks function goes here

  // Ensure landmark elements have IDs
  html = html.replace(/<(header|nav|main|aside|footer|section|article)>/gi, (match) => {
    const landmarkId = generateUniqueLandmarkId(match);
    return `<${match} id="${landmarkId}">`;
  });

  return html;
}

/**
 * Generates a unique ID based on the given landmark name
 * This function is used to create unique IDs for landmarks
 * @param {string} landmark - The landmark name taken from an HTML tag (e.g., header, nav, main, etc.)
 * @returns {string} Unique landmark ID
 */
function generateUniqueLandmarkId(landmark) {
  return `${landmark.toLowerCase()}-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
}

/**
 * Adds/fixes landmark issues
 * @param {string} html - The HTML string to process
 * @returns {string} HTML with landmark issues addressed
 */
export function validateLandmark(html) {
  if (typeof html !== 'string') return html;

  html = validateLandmarkStructure(html);

  // Check if missing landmarks exist, and if so, add them
  const missingLandmarks = ['banner', 'complementary', 'contentinfo', 'forms'];
  missingLandmarks.forEach(landmark => {
    if (!document.querySelector(landmark)) {
      const landmarkId = generateUniqueLandmarkId(landmark);
      html += `<${landmark} id="${landmarkId}"></${landmark}>`;
    }
  });

  return html;
}

/**
 * Validates Link elements, ensures they are accessible
 * @param {string} html - The HTML string to process
 * @returns {string} HTML with validated links
 */
export function validateLinks(html) {
  if (typeof html !== 'string') return html;

  // Check if Link elements are accessible
  html = html.replace(/<a([^>]*)href)/gi, (match, attrs) => {
    const href = match.match(/(href="[^"]*")/)[1];
    const isAnchorEmpty = /^[\s\u00A0]+$/.test(match.replace(href, ''));
    if (isAnchorEmpty) {
      return match;
    }

    // Check if href is internal or external
    if (href.startsWith('#')) {
      return match;
    }

    // Add role="button" for non-button Link elements
    if (attrs.includes('role="button"')) {
      return match.replace(/role="button"/, '');
    }
    return match + ' role="button"';
  });

  return html;
}