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
                <th></th>
                <th scope="col">Header 1</th>
                <th scope="col">Header 2</th>
                <th scope="col">Header 3</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th scope="row">Row 1</th>
                <td>Data 1</td>
                <td>Data 2</td>
                <td>Data 3</td>
              </tr>
              <tr>
                <th scope="row">Row 2</th>
                <td>Data 4</td>
                <td>Data 5</td>
                <td>Data 6</td>
              </tr>
              <tr>
                <th scope="row">Row 3</th>
                <td>Data 7</td>
                <td>Data 8</td>
                <td>Data 9</td>
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