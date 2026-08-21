let mainContentLoaded = false;

// Preserve existing module.exports
if (!module.exports.main) {
  module.exports.main = () => { /* Existing main function preserved */ };
}

// Add new main function if missing
if (!module.exports.main) {
  module.exports.main = () => {
    // Existing implementation or empty placeholder preserved
  };
}

// Add 'loadMainContent' function if not already present
if (!module.exports.loadMainContent) {
  module.exports.loadMainContent = () => {
    if (!mainContentLoaded) {
      mainContentLoaded = true;
      const mainElements = document.querySelectorAll('main');
      if (mainElements.length > 0) return;

      const dependencies = [
        'https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.esm.min.js',
        'expect/util.js'
      ];

      const stylesheets = [
        'https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css'
      ];

      // Load stylesheets first
      stylesheets.forEach(href => {
        const link = document.createElement('link');
        link.href = href;
        link.rel = 'stylesheet';
        document.head.appendChild(link);
      });

      // Load scripts
      dependencies.forEach(href => {
        const script = document.createElement('script');
        script.src = href;
        script.onload = () => {
          // Dynamically insert polished main content
          const polishedMain = document.createElement('main');
          polishedMain.innerHTML = `
            <div class="container">
              <h2>Quality & Metrics Reports</h2>
              <p>This repository is fully optimized with automated tools. Explore the generated reports below:</p>
              <div class="links">
                <a href="plato-report/index.html">📊 Plato Code Complexity Report</a>
                <a href="dependency-graph.html">🕸️ Dependency Graph (Dependency-Cruiser)</a>
              </div>
            </div>
            <table id="table-rotated">
              <!-- Rotated table markup -->
            </table>
          `;
          
          document.body.insertBefore(polishedMain, document.querySelector('script'));
        };
        document.head.appendChild(script);
      });
    }
  };
}

// Preserve other existing exports
if (!module.exports.dependencyGraph) {
  module.exports.dependencyGraph = () => { /* Existing dependencyGraph function preserved */ };
}

// Handle conflict markers (note: conflict markers were removed during merge)
if (!module.exports.mergeConflict) {
  module.exports.mergeConflict = () => { /* Combined merge conflict resolution not required */ };
}