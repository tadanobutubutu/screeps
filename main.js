import React from 'react';
import { Dashboard } from './Dashboard';

// Existing utilities
const existingFunction = () => {
  console.log("This is an existing function.");
};

const initApp = () => {
  console.log("Initializing the app.");
};

// Global variable
let globalVariable = "I'm a global variable.";

// Export utilities for CommonJS compatibility
module.exports = {
  existingFunction,
  initApp,
};

// Dashboard wrappers and routes
const DashboardWrapper = () => <Dashboard />;
const SuccessDashboardRoute = () => <Dashboard success />;
const ErrorDashboardRoute = () => <Dashboard error />;

// Primary UI component
const PrimaryContent = () => {
  return (
    <div className="primary-content">
      <nav aria-label="Primary Navigation">
        <a href="/">Home</a>
      </nav>

      <section aria-label="Main Content">
        <h1>Overview</h1>

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

const MainComponent = () => {
  return (
    <main>
      <PrimaryContent />
    </main>
  );
};

// Export named components for use elsewhere
export { DashboardWrapper, SuccessDashboardRoute, ErrorDashboardRoute };
export default MainComponent;