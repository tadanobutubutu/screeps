import React from 'react';
import ReactDOM from 'react-dom';

// Example component structure (you should replace these with your actual components)
const DependencyGraphPage = () => {
  // ... component logic for dependency-graph.html ...

  return (
    <div>
      {/* ... existing content ... */}
      <main>
        <table id="table-rotated">
          {/* ... table content ... */}
        </table>
      </main>
      {/* ... existing content ... */}
    </div>
  );
};

const HomePage = () => {
  // ... component logic for index.html ...

  return (
    <div>
      <main>
        <div class="container">
          <h2>Quality & Metrics Reports</h2>
          <p>
            This repository is fully optimized with automated tools. Explore the generated
            reports below:
          </p>
          <div class="links">
            <a href="plato-report/index.html">📊 Plato Code Complexity Report</a>
            <a href="dependency-graph.html">🕸️ Dependency Graph (Dependency-Cruiser)</a>
          </div>
        </div>
      </main>
      {/* ... existing content ... */}
    </div>
  );
};

const App = () => {
  return (
    <div>
      {/* Render the appropriate page based on some logic or route */}
      <DependencyGraphPage />
      {/* or */}
      <HomePage />
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));