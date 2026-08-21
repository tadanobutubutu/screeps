// REACT_017: React Landmarks - Helper Functions
// Checks if HTML content has a <main> landmark for accessibility

/**
 * Checks if the given HTML content contains a <main> landmark
 * @param {string} htmlContent - The HTML content to check
 * @returns {boolean} - True if <main> landmark is present
 */
function hasMainLandmark(htmlContent) {
  if (!htmlContent || typeof htmlContent !== 'string') {
    return false;
  }
  // Match <main> tag with optional attributes
  const mainTagRegex = /<main(?:\s[^>]*)?\s*>/i;
  return mainTagRegex.test(htmlContent);
}

/**
 * Validates a list of HTML files for the <main> landmark requirement (REACT_017)
 * @param {Array<{path: string, content: string}>} files - Array of file objects with path and content
 * @returns {Object} - Object with passed and failed file arrays
 */
function checkMainLandmarks(files) {
  const results = {
    passed: [],
    failed: [],
    warnings: 2 // Number of occurrences from issue
  };

  if (!Array.isArray(files)) {
    return results;
  }

  files.forEach(file => {
    if (file && file.path && hasMainLandmark(file.content)) {
      results.passed.push(file.path);
    } else if (file && file.path) {
      results.failed.push(file.path);
    }
  });

  return results;
}

/**
 * Adds a <main> landmark wrapper around content if missing
 * @param {string} htmlContent - The HTML content to modify
 * @param {string} contentToWrap - The content to wrap in <main> tags
 * @returns {string} - Modified HTML content with <main> landmark
 */
function addMainLandmark(htmlContent, contentToWrap) {
  if (!htmlContent || !contentToWrap) {
    return htmlContent;
  }

  if (hasMainLandmark(htmlContent)) {
    return htmlContent; // Already has main landmark
  }

  // Insert main landmark after <body> or before closing </body>
  const bodyMatch = htmlContent.match(/<body(?:\s[^>]*)?>/i);
  if (bodyMatch) {
    const bodyTag = bodyMatch[0];
    const bodyIndex = htmlContent.indexOf(bodyTag) + bodyTag.length;
    return (
      htmlContent.slice(0, bodyIndex) +
      '\n    <main>' +
      contentToWrap +
      '</main>\n' +
      htmlContent.slice(bodyIndex)
    );
  }

  // Fallback: insert at the beginning if no body tag found
  return '<main>\n' + contentToWrap + '\n</main>\n' + htmlContent;
}

module.exports = {
  hasMainLandmark,
  checkMainLandmarks,
  addMainLandmark
};