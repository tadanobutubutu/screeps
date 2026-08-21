export default function App() {
  return (
    <div className="app">
      {/* Skip link for accessibility */}
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      
      <header>
        <h1>Application Header</h1>
      </header>
      
      <main id="main-content">
        <table id="table-rotated">
          {/* Table content */}
        </table>
        
        <div className="container">
          <h2>Quality & Metrics Reports</h2>
          <p>
            This repository is fully optimized with automated tools. Explore the generated
            reports below:
          </p>
          <div className="links">
            <a href="/plato">Plato Code Complexity Report</a>
            <a href="/dependency-graph">Dependency Graph</a>
          </div>
        </div>
      </main>
      
      <footer>
        <p>Footer content</p>
      </footer>
    </div>
  );
}