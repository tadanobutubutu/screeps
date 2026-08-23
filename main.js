import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

// Component for the main page
function App() {
  return (
    <div>
      <header className="header">
        <h1>Screeps</h1>
        <nav aria-label="Main navigation">
          <a href="/">Home</a>
        </nav>
      </header>

      <main role="main">
        <div className="container">
          <h2>Quality & Metrics Reports</h2>
          <p>
            This repository is fully optimized with automated tools. Explore the generated
            reports below:
          </p>
          <div className="links">
            <a href="/plato" aria-label="Plato Code Complexity Report">Plato Code Complexity Report</a>
            <a href="/dependency-graph" aria-label="Dependency Graph Report">Dependency Graph</a>
          </div>

          {/* Primary data table */}
          <table id="table-rotated" aria-label="Code metrics data">
            <thead>
              <tr>
                <th scope="col">Metric</th>
                <th scope="col">Value</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>File</td>
                <td>test.js</td>
              </tr>
            </tbody>
          </table>
        </div>
      </main>

      <footer className="footer" role="contentinfo">
        <p>© 2025 Screeps</p>
      </footer>
    </div>
  );
}

// Export the component
export default App;