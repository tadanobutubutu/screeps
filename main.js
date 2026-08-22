import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

// Component for the main page
function App() {
  return (
    <div>
      <header className="header">
        <h1>Screeps</h1>
      </header>

      <main>
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

          {/* Primary data table */}
          <table id="table-rotated">
            {/* Table rows go here */}
          </table>
        </div>
      </main>

      <footer className="footer">
        <p>© 2025 Screeps</p>
      </footer>
    </div>
  );
}

// Export the component
export default App;