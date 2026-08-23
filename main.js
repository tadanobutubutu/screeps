bash
// Create a function to generate the html string with the lang attribute
function generateHtmlWithLang() {
  const html = `
<html lang="en">
<!-- ... Your existing html content ... -->
</html>
  `;

  return html;
}

// Modify the build script to use the new function
const html = generateHtmlWithLang();
// ... other operations to write the html to the docs/dependency-graph.html file ...