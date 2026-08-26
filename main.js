// Example of a possible main.js that needs to include the <main> tag

function renderPage() {
  // Simulated data that might be used to generate the HTML content
  const pageContent = `
    <h2>Quality & Metrics Reports</h2>
    <p>This repository is fully optimized with automated tools. Explore the generated
    reports below:</p>
    <div class="links">
      <a href="plato-report/index.html">📊 Plato Code Complexity Report</a>
      <a href="dependency-graph.html">🕸️ Dependency Graph (Dependency-Cruiser)</a>
    </div>
  `;

  // Simulated function that would append the page content to the DOM
  document.body.appendChild(createMainElement(pageContent));
}

function createMainElement(content) {
  // Create a new main element
  const mainElement = document.createElement('main');

  // Append the content to the main element
  mainElement.innerHTML = content;

  // Return the main element
  return mainElement;
}

// Render the page when the script loads
renderPage();