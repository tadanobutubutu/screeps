// If main.js renders HTML directly, wrap with lang attribute:
// Example for a template-based approach:
const html = `<html lang="en">
  <head>...</head>
  <body>
    <div id="root"></div>
  </body>
</html>`;

// Or if using a function that builds HTML:
function renderHTML() {
  return `<!DOCTYPE html>
<html lang="en">
  <head>...</head>
  <body>
    <div id="root"></div>
  </body>
</html>`;
}