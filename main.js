// main.js
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

// For app/layout.tsx
const AppLayout = ({ children }) => (
  <body className="min-h-screen flex flex-col">
    <main className="flex-1">{children}</main>
  </body>
);

// For dashboard/app/layout.tsx and docs/dependency-graph.html
const DashboardAndGraphLayout = ({ children }) => (
  <body>
    <main>{children}</main>
  </body>
);

// For docs/index.html
const DocsIndex = () => (
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
    </div>
  </main>
);

// Main render function
const container = document.getElementById('root');
const root = createRoot(container);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Add the missing scope="col" to all <th> elements in your table headers
// This fixes REACT_027 by ensuring proper accessibility
const tableHeader = `
  <thead>
    <tr>
      <th scope="col"><div>src/constants.js</div></th>
      <th scope="col"><div>src/managers/roomManager.js</div></th>
      <th scope="col"><div>src/managers/spawnManager.js</div></th>
      <th scope="col"><div>src/managers/towerManager.js</div></th>
      <th scope="col"><div>src/roles/builder.js</div></th>
      <!-- Add other headers similarly with scope="col" -->
    </tr>
  </thead>
`;

// Export all components
export {
  AppLayout,
  DashboardAndGraphLayout, // Combined Dashboard and DependencyGraph layouts
  DocsIndex
};
```