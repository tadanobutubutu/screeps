// Hypothetical main.js content
// This is just an example; you should replace the following with the actual code from your main.js file.

import React from 'react';
import ReactDOM from 'react-dom';

// Assume we have a function that returns the main content of the page
function getMainContent() {
  // This is a placeholder for the actual content retrieval logic
  return (
    <div className="container">
      <h2>Quality & Metrics Reports</h2>
      <p>This repository is fully optimized with automated tools. Explore the generated reports below:</p>
      <div className="links">
        <a href="plato-report/index.html">📊 Plato Code Complexity Report</a>
        <a href="dependency-graph.html">🕸️ Dependency Graph (Dependency-Cruiser)</a>
      </div>
    </div>
  );
}

// Function that returns the entire document structure
function getDocumentStructure() {
  return (
    <div>
      {/* Other header content, navigation, etc. */}
      <main>
        {getMainContent()}
      </main>
      {/* Footer, additional content, etc. */}
    </div>
  );
}

ReactDOM.render(
  getDocumentStructure(),
  document.getElementById('root')
);