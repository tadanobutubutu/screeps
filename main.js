/* eslint-disable imported-modules, no-unused-vars */
import React from 'react';

let globalVariable = "I'm a global variable.";

const existingFunction = () => {
  console.log("This is an existing function.");
};

const initApp = () => {
  console.log("Initializing the app.");
};

module.exports = {
  existingFunction,
  // New function added here
  initApp,
};

// Example usage of the new initApp function
module.exports.initApp();

// React component for the web interface
const PrimaryContent = () => {
  return (
    <div className="primary-content">
      {/* Your primary content goes here */}
      <nav aria-label="Primary Navigation">
        <a href="/">Home</a>
      </nav>

      <section aria-label="Main Content">
        <h1>Overview</h1>

        {/* Fixed table structures for REACT_027 */}
        <table>
          <caption>User Records</caption>
          <thead>
            <tr>
              <th scope="col">Name</th>
              <th scope="col">Status</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row">Alice</th>
              <td>Active</td>
            </tr>
            <tr>
              <th scope="row">Bob</th>
              <td>Inactive</td>
            </tr>
          </tbody>
        </table>

        <table>
          <caption>Metrics</caption>
          <thead>
            <tr>
              <th scope="col">Metric</th>
              <th scope="col">Value</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row">Access</th>
              <td>87/100</td>
            </tr>
          </tbody>
        </table>

        {/* Fixed SVG accessible names for REACT_041 */}
        <svg
          role="img"
          aria-label="Data Chart"
          xmlns="http://www.w3.org/2000/svg"
          width="200"
          height="100"
        >
          <title>Data Chart</title>
          <rect x="10" y="10" width="180" height="80" fill="#ccc" />
        </svg>

        {/* Fixed fake link for REACT_036 */}
        <button type="button" onClick={() => console.log('action')}>
          Perform Action
        </button>
      </section>

      <aside aria-label="Sidebar">
        <h2>Related Info</h2>
      </aside>

      <footer aria-label="Footer">
        <p>Footer content</p>
      </footer>
    </div>
  );
};

// Your main component that will render the primary content wrapped in <main>
const MainComponent = () => {
  return (
    <main>
      <PrimaryContent />
    </main>
  );
};

export default MainComponent;