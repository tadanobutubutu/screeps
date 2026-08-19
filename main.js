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

// New additions for the other files:

// For app/layout.tsx and dashboard/app/layout.tsx
export function Layout({ children }) {
  return (
    <main>
      <body>{children}</body>
    </main>
  );
}

// For docs/dependency-graph.html
export function DependencyGraph() {
  return (
    <main>
      <table id="table-rotated">
        {/* existing content */}
      </table>
    </main>
  );
}

// For docs/index.html
export function DocsIndex() {
  return (
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
}