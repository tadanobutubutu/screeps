import React from 'react';
import ReactDOM from 'react-dom';
import './docs/dependency-graph'; // Assuming this is the component that renders the dependency-graph.html
import './docs/index'; // Assuming this is the component that renders the index.html

// Component that renders the content of dependency-graph.html
const DependencyGraphComponent = () => {
  return (
    <div>
      <main>
        {/* Existing content from dependency-graph.html */}
        <table id="table-rotated">
          {/* ... */}
        </table>
      </main>
    </div>
  );
};

// Component that renders the content of index.html
const IndexComponent = () => {
  return (
    <div>
      <main>
        {/* Existing content from index.html */}
        <div class="container">
          <h2>Quality & Metrics Reports</h2>
          <p>This repository is fully optimized with automated tools. Explore the generated reports below:</p>
          <div class="links">
            <a href="plato-report/index.html">📊 Plato Code Complexity Report</a>
            <a href="dependency-graph.html">🕸️ Dependency Graph (Dependency-Cruiser)</a>
          </div>
        </div>
      </main>
    </div>
  );
};

ReactDOM.render(<DependencyGraphComponent />, document.getElementById('dependency-graph-root'));
ReactDOM.render(<IndexComponent />, document.getElementById('index-root'));