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
            <a ... Plato Code Complexity Report</a>
            <a ... Dependency Graph ...
          </div>

          {/* Primary data table */}
          <table id="table-rotated">
            <thead>
              <tr>
                <th scope="col">Report Type</th>
                <th scope="col">Link</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th scope="row">Plato Code Complexity Report</th>
                <td><a ...</a></td>
              </tr>
              <tr>
                <th scope="row">Dependency Graph</th>
                <td><a ...</a></td>
              </tr>
            </tbody>
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