// main.js - Main application entry point

/**
 * Renders the main HTML document structure
 * @returns {string} The HTML document string
 */
function renderDocument() {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Application</title>
</head>
<body>
  <div id="root"></div>
</body>
</html>
  `.trim();
}

module.exports = {
  renderDocument
};