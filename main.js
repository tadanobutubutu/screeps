// main.js
// Insight Code: REACT_017 — React Landmarks fix

module.exports = {
  /**
   * Wraps content in a <main> landmark for accessibility
   * @param {string} content - The content to wrap
   * @returns {string} Content wrapped in <main> tag
   */
  wrapInMainLandmark: function(content) {
    return `<main>${content}</main>`;
  },

  /**
   * Generates HTML with proper landmarks for accessibility
   * @param {Object} options - Options object
   * @param {string} options.content - Main content
   * @param {string} [options.title] - Page title
   * @returns {string} Complete HTML document with landmarks
   */
  generateHTML: function(options) {
    const { content, title = 'Page' } = options;
    
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
</head>
<body>
    <header>
        <nav>Navigation content</nav>
    </header>
    <main>
        ${content}
    </main>
    <footer>Footer content</footer>
</body>
</html>`;
  }
};