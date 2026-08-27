const originalMainJs = require('./src/main.js');

// Re-export the original main module functionality to preserve existing behavior
module.exports = originalMainJs;

// Note: The REACT_017 accessibility issue about missing <main> landmarks
// should be addressed directly in the HTML files (docs/index.html, etc.)
// by wrapping the primary content in <main> tags for proper accessibility.
//
// Example fix for docs/index.html:
// <body>
//     <header>...</header>
//     <main>
//         <!-- Primary content here -->
//     </main>
//     <footer>...</footer>
// </body>