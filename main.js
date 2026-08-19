// main.js
import React from 'react';
import { createRoot } from 'react-dom/client';

// Existing code (preserved)
const App = () => {
  // ... existing app code ...
};

// Existing exports (preserved)
export { App };

// Add accessible name to SVG in layout.tsx and dashboard/app/layout.tsx
const FaviconSVG = () => (
  <svg
    aria-hidden="true"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 100 100"
  >
    <title>Screeps Favicon</title>
    {/* SVG content */}
  </svg>
);

const DashboardFaviconSVG = () => (
  <svg
    aria-hidden="true"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 100 100"
  >
    <title>Dashboard Favicon</title>
    {/* SVG content */}
  </svg>
);

// Preserve any existing exports
export { FaviconSVG, DashboardFaviconSVG };

export function DataView({ data, isLoading, error }) {
  return (
    <main>
      {isLoading && (
        <section aria-busy="true" aria-label="Loading content">
          <p>Loading...</p>
        </section>
      )}

      {error && (
        <section role="alert" aria-label="Error message">
          <p>Error: {error}</p>
        </section>
      )}

      {!isLoading && !error && data && (
        <section aria-label="Main content">
          <h1>{data.title}</h1>
          <p>{data.description}</p>
        </section>
      )}
    </main>
  );
}

// Add table header scope attributes for accessibility
export function DependencyGraphTable() {
  return (
    <table>
      <thead>
        <tr>
          <th scope="col"><div>src/constants.js</div></th>
          <th scope="col"><div>src/managers/roomManager.js</div></th>
          <th scope="col"><div>src/managers/spawnManager.js</div></th>
          <th scope="col"><div>src/managers/towerManager.js</div></th>
          <th scope="col"><div>src/roles/builder.js</div></th>
          {/* Additional headers with scope attributes */}
        </tr>
      </thead>
      <tbody>
        {/* Table body content */}
      </tbody>
    </table>
  );
}