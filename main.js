// Assuming the `main.js` file is responsible for rendering the HTML, you might have a component or function that renders the HTML for this file.

// Before the change:
// (Example of a component that renders the HTML for `dependency-graph.html`)
export function renderDependencyGraph() {
  // ... existing code that generates the HTML for `dependency-graph.html`
  return `
    <!DOCTYPE html>
    <html>
    <!-- Existing content -->
    </html>
  `;
}

// After the change, add the lang attribute to the <html> tag:
export function renderDependencyGraph() {
  // ... existing code that generates the HTML for `dependency-graph.html`
  return `
    <!DOCTYPE html>
    <html lang="en">
    <!-- Existing content -->
    </html>
  `;
}