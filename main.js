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
  return str.replace(/[&<>"']/g, char => htmlEscapeMap[char]);
}

// Export utilities for testing
module.exports = {
  hasMainLandmark,
  addMainLandmark,
  escapeHtml
};