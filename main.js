import React from 'react';

// For app/layout.tsx
export function AppLayout({ children }) {
  return (
    <body className="min-h-screen flex flex-col">
      <main className="flex-1">{children}</main>
    </body>
  );
}

// For dashboard/app/layout.tsx
export function DashboardLayout({ children }) {
  return (
    <body>{children}</body>
  );
}

// For docs/dependency-graph.html
export function DependencyGraph() {
  return (
    <html>
      <body>
        <main>
          <table id="table-rotated">
            {/* table content */}
          </table>
        </main>
      </body>
    </html>
  );
}

// For docs/index.html
export function DocsIndex() {
  return (
    <html>
      <body>
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
      </body>
    </html>
  );
}

// Any existing exports from the original main.js should remain unchanged
// For example, if there were these exports:
export const existingFunction = () => {
  // existing code
};

export const anotherExistingFunction = () => {
  // existing code
};