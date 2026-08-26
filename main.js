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

  <!-- Added landmark regions -->
  <region id="landmark1" aria-label="Landmark 1"></region>
  <region id="landmark2" aria-label="Landmark 2"></region>

</body>
</html>
  `.trim();
}

function addLandmarkRegions() {
  // Your implementation here...
}

module.exports = {
  renderDocument,
  addLandmarkRegions // Added the new export for the function
};