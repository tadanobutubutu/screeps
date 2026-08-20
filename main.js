// Existing code begins
// (original content preserved)

// Updated HTML generation to include language attribute
function getHtml() {
  return `<html lang="en">
  <head>
    <meta charset="UTF-8">
    <title>MyApp</title>
  </head>
  <body>
    <div id="root"></div>
  </body>
</html>`;
}

// Preserve all existing exports and functions
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    getHtml,
    // Keep any other existing exports unchanged
    ...module.exports,
  };
}

// Existing code ends