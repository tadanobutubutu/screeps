// If main.js renders HTML directly, wrap with lang attribute:
// Example for a template-based approach:
const html = `<html lang="en">
  <head>...</head>
  <body>
    <main> <!-- Existing <main> element -->
      <!-- Existing content inside <main> -->
    </main>
    <!-- New section added to replace duplicate <main> -->
    <section id="dashboard-content">
      <!-- Dashboard content that was in the duplicate <main> -->
    </section>
    <div id="root"></div>
  </body>
</html>`;

// Or if using a function that builds HTML:
function renderHTML() {
  return `<!DOCTYPE html>
<html lang="en">
  <head>...</head>
  <body>
    <main> <!-- Existing <main> element -->
      <!-- Existing content inside <main> -->
    </main>
    <section id="dashboard-content">
      <!-- Dashboard content that was in the duplicate <main> -->
    </section>
    <div id="root"></div>
  </body>
</html>`;
}