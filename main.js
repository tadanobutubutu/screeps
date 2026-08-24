<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="Screeps Bot Repository">
  <meta name="author" content="Your Name">
  <!-- Other meta tags -->

  <title>Screeps Bot Repository</title>
  <link rel="icon" type="image/png" href="favicon.ico">
  <!-- Other head content -->
</head>
<body>

  <!-- Landmark Regions for accessibility -->
  <main id="landmark-main">
    <div class="container">
      <h2>Quality & Metrics Reports</h2>
      <p>This repository is fully optimized with automated tools. Explore the generated reports below:</p>
      <div class="links">
        <a href="plato-report/index.html">📊 Plato Code Complexity Report</a>
        <a href="dependency-graph.html">🕸️ Dependency Graph (Dependency-Cruiser)</a>
      </div>
    </div>

    <!-- Dependency Graph Content -->
    <main id="landmark-dependency-graph" role="region" aria-label="Dependency Graph">
      <!-- Dependency Graph Container -->
      <div id="dependency-graph-container"></div>
    </main>

    <!-- Index View Content -->
    <main id="landmark-index" role="region" aria-label="Index View">
      <!-- Index View Container -->
      <div id="index-view-container"></div>
    </main>

  <!-- Other body content -->

  <!-- JavaScript files -->
  <script src="main.js"></script>
  <!-- Other script files -->
</body>
</html>

// main.js
function wrapInMainLandmark(content) {
  return `<main>\n${content}\n</main>`;
}

// Other main.js content (the rest of the file)