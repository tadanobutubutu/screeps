import React from 'react';
import ReactDOM from 'react-dom';

const MainContent = ({ children }) => {
  return (
    <main>
      {children}
    </main>
  );
};

// Component for dependency-graph.html
const DependencyGraphComponent = () => (
  <MainContent>
    <div id="table-rotated">
      {/* existing table content */}
    </div>
  </MainContent>
);

// Component for index.html
const IndexComponent = () => (
  <MainContent>
    <div className="container">
      <h2>Quality & Metrics Reports</h2>
      <p>
        This repository is fully optimized with automated tools. Explore the generated
        reports below:
      </p>
      <div className="links">
        <a href="plato-report/index.html">📊 Plato Code Complexity Report</a>
        <a href="dependency-graph.html">🕸️ Dependency Graph (Dependency-Cruiser)</a>
      </div>
    </div>
  </MainContent>
);

ReactDOM.render(<DependencyGraphComponent />, document.getElementById('dependency-graph-app'));
ReactDOM.render(<IndexComponent />, document.getElementById('index-app'));