import React from 'react';
import ReactDOM from 'react-dom';
import './styles.css';

function App() {
  return (
    <div>
      <header>
        <h1>Quality Metrics</h1>
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
          <table id="table-rotated">
            {/* table content */}
          </table>
        </div>
      </main>
      <footer>
        <p>© 2025 Screeps</p>
      </footer>
    </div>
  );
}

export default App;