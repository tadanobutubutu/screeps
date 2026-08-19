import React from 'react';

const Main = () => {
  return (
    <div lang="en">
      <main>
        <div className="container">
          <h2>Quality & Metrics Reports</h2>
          <p>This repository is fully optimized with automated tools. Explore the generated reports below:</p>
          <div className="links">
            <a href="/code-complexity">Code Complexity Report</a>
            <a href="/dependency-graph" id="dependencyGraphLink">Dependency Graph</a>
            <button id="unrotate" onClick={() => {/* Rotate back functionality here */}}>rotate back</button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Main;