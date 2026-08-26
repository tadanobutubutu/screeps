import React from 'react';
import ReactDOM from 'react-dom';

function App() {
  return (
    <div>
      <header>
        <h1>Screeps Dashboard</h1>
      </header>
      <main>
        <div className="container">
          <h2>Quality & Metrics Reports</h2>
          <p>
            This repository is fully optimized with automated tools. Explore the generated
            reports below:
          </p>
          <div className="links">
            <a href="/plato" aria-label="View Plato Code Complexity Report">Plato Code Complexity Report</a>
            <a href="/dependency-graph" aria-label="View Dependency Graph">Dependency Graph</a>
          </div>
          <table id="table-rotated">
            <thead>
              <tr>
                <th scope="col">Metric</th>
                <th scope="col">Value</th>
                <th scope="col">Trend</th>
                <th scope="col">Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th scope="row">Code Complexity</th>
                <td>Medium</td>
                <td>Improving</td>
                <td>Good</td>
              </tr>
              <tr>
                <th scope="row">Test Coverage</th>
                <td>85%</td>
                <td>Increasing</td>
                <td>Excellent</td>
              </tr>
              <tr>
                <th scope="row">Lines of Code</th>
                <td>12,450</td>
                <td>Stable</td>
                <td>Good</td>
              </tr>
              <tr>
                <th scope="row">Dependencies</th>
                <td>24</td>
                <td>Reducing</td>
                <td>Good</td>
              </tr>
              <tr>
                <th scope="row">Performance Score</th>
                <td>92</td>
                <td>Improving</td>
                <td>Excellent</td>
              </tr>
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}

export default App;