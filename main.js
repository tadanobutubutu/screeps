// main.js - Helper utilities for accessibility fixes

/**
 * Checks if the given JSX/TSX content has a <main> landmark
 * @param {string} content - File content to check
 * @returns {boolean} - True if <main> landmark exists
 */
function hasMainLandmark(content) {
  const mainRegex = /<main[\s>]/gi;
  return mainRegex.test(content);
}

/**
 * Counts the number of <main> landmarks in the given content
 * @param {string} content - File content to check
 * @returns {number} - Number of <main> landmarks found
 */
function countMainLandmarks(content) {
  const mainRegex = /<main[\s>]/gi;
  const matches = content.match(mainRegex);
  return matches ? matches.length : 0;
}

/**
 * Checks if content has multiple <main> landmarks (accessibility violation)
 * @param {string} content - File content to check
 * @returns {boolean} - True if multiple <main> landmarks exist
 */
function hasMultipleMainLandmarks(content) {
  return countMainLandmarks(content) > 1;
}

/**
 * Replaces additional <main> elements with <section> for accessibility
 * Keeps the first <main> and converts subsequent ones to <section>
 * @param {string} content - File content to modify
 * @returns {string} - Modified content with extra <main> converted to <section>
 */
function replaceExtraMainsWithSections(content) {
  let mainCount = 0;
  
  return content.replace(/<main[\s>]/gi, (match) => {
    mainCount++;
    // Keep the first <main>, replace subsequent ones with <section>
    if (mainCount > 1) {
      return '<section';
    }
    return match;
  });
}

/**
 * Wraps children in a <main> landmark
 * @param {string} content - File content to modify
 * @param {string} childrenTag - The tag containing main children (e.g., 'body', 'div')
 * @returns {string} - Modified content with <main> landmark
 */
function addMainLandmark(content, childrenTag = 'children') {
  // Pattern to find <body>{children}</body> or <div>{children}</div>
  const bodyPattern = /<(\w+)>\s*\{(\w+)\}\s*<\/\1>/g;
  
  return content.replace(bodyPattern, (match, tag, children) => {
    if (tag === 'body' || tag === 'div' || tag === 'section') {
      return `<${tag}>\n    <main>\n        {${children}}\n    </main>\n</${tag}>`;
    }
    return match;
  });
}

/**
 * Escapes HTML entities in a string
 * @param {string} str - String to escape
 * @returns {string} - Escaped string
 */
function escapeHtml(str) {
  const htmlEscapeMap = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  };
  return str.split('').map(char => htmlEscapeMap[char] || char).join('');
}

// Export utilities for testing
module.exports = {
  hasMainLandmark,
  countMainLandmarks,
  hasMultipleMainLandmarks,
  replaceExtraMainsWithSections,
  addMainLandmark,
  escapeHtml
};