// Assuming this is a part of main.js where HTML content is being used

// Original HTML snippet (likely causing the issue)
// <!DOCTYPE html>
// <html>
// <head>
//   ...
// </head>
// <body>
//   ...
// </body>
// </html>

// Corrected HTML snippet with lang attribute added
// <!DOCTYPE html>
// <html lang="en">
// <head>
//   ...
// </head>
// <body>
//   ...
// </body>
// </html>

/**
 * Ensures the HTML lang attribute is present on an HTML string
 * @param {string} html - The HTML string to process
 * @returns {string} - The HTML string with lang attribute added if missing
 */
function ensureHtmlLangAttribute(html) {
  // Check if the HTML has a lang attribute on the html tag
  const hasLangAttribute = /<html[^>]*lang\s*=/i.test(html);
  
  if (!hasLangAttribute) {
    // Add lang="en" to the html tag
    return html.replace(/<html([^>]*)>/i, '<html$1 lang="en">');
  }
  
  return html;
}

module.exports = {
  ensureHtmlLangAttribute
};