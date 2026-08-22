const fs = require('fs');
const path = require('path');

/**
 * This appears to be a template or placeholder code.
 * Based on the issue REACT_015, this file likely contains code that generates or validates HTML files.
 * 
 * The issue requires adding lang="en" to the <html> element for accessibility.
 */

// Example structure that would need to be updated to include lang attribute:

function generateHtmlDocument() {
  return `<!DOCTYPE html>
<html lang="en"> <!-- Added lang attribute for REACT_015 -->
<head>
  <meta charset="UTF-8">
  <title>Document</title>
</head>
<body>
  <!-- content -->
</body>
</html>`;
}

// If there's an existing function that generates HTML, ensure it includes lang attribute:

function createAppMarkup() {
  return `<html lang="en">
  <head>
    <meta charset="UTF-8">
  </head>
  <body>
    <div id="root"></div>
  </body>
</html>`;
}

// Utility function to check HTML content
function validateHtmlContent(content) {
  const hasLangAttribute = /<html[^>]*lang=["'][^"']*["'][^>]*>/i.test(content);
  return {
    hasLangAttribute,
    valid: hasLangAttribute
  };
}

module.exports = {
  generateHtmlDocument,
  createAppMarkup,
  validateHtmlContent
};