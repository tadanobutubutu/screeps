import React from 'react';

function App() {
  // Assuming the existing App component renders the contents of the files in question
  // and we need to ensure it renders the primary content inside a <main> tag.
  return (
    <div>
      <main>
        {/* Content of docs/dependency-graph.html */}
        <table id="table-rotated">
          {/* Table rows and data */}
        </table>

        {/* Content of docs/index.html */}
        <div class="container">
          <h2>Quality & Metrics Reports</h2>
          <p>This repository is fully optimized with automated tools. Explore the generated reports below:</p>
          <div class="links">
            <a href="plato-report/index.html">📊 Plato Code Complexity Report</a>
            <a href="dependency-graph.html">🕸️ Dependency Graph (Dependency-Cruiser)</a>
          </div>
        </div>
      </main>
      {/* Rest of the App component */}
      <UserSafety unsafe={true} />
      <SafetyCategories categories={['Unauthorized Advice']} />
    </div>
  );
}

export default App;