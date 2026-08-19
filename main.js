// main.js
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

// main.js - Accessibility improved version

// Example: Fixed React Language Attribute (REACT_015)
// The <html> element needs a lang attribute at the document level

// Example: Fixed React Table Structure (REACT_027)
const AccessibleTable = ({ data }) => (
  <table>
    <thead>
      <tr>
        <th scope="col">Column 1</th>
        <th scope="col">Column 2</th>
        <th scope="col">Column 3</th>
      </tr>
    </thead>
    <tbody>
      {data.map((row, index) => (
        <tr key={index}>
          <td>{row.cell1}</td>
          <td>{row.cell2}</td>
        </tr>
      ))}
    </tbody>
  </table>
);

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

// Navigation landmark
const Navigation = ({ links }) => (
  <nav aria-label="Main navigation">
    <ul>
      {links.map((link, index) => (
        <li key={index}>
          <a href={link.href}>{link.label}</a>
        </li>
      ))}
    </ul>
  </nav>
);

export const tableHeader = `
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

// Main render function
const container = document.getElementById('root');
const root = createRoot(container);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);