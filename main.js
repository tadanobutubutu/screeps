// Hypothetical main.js before modifications

// Example Component A (Assuming it is a part of the `docs/dependency-graph.html` component)
import React from 'react';

function DependencyGraphComponent() {
  return (
    <div>
      <h1>Dependency Graph</h1>
      {/* Existing content here */}
    </div>
  );
}

export default DependencyGraphComponent;

// Example Component B (Assuming it is a part of the `docs/index.html` component)
import React from 'react';

function IndexComponent() {
  return (
    <div>
      <header>
        <h1>Quality & Metrics Reports</h1>
        {/* Existing header content */}
      </header>
      <main>
        <div className="container">
          <h2>Quality & Metrics Reports</h2>
          <p>This repository is fully optimized with automated tools. Explore the generated reports below:</p>
          <div className="links">
            <a href="plato-report/index.html">📊 Plato Code Complexity Report</a>
            <a href="dependency-graph.html">🕸️ Dependency Graph (Dependency-Cruiser)</a>
          </div>
        </div>
      </main>
      {/* Existing footer content */}
    </div>
  );
}

export default IndexComponent;

// Hypothetical main.js after modifications

// Now, if we assume `main.js` imports the above components, it might look like this:

import React from 'react';
import ReactDOM from 'react-dom';
import DependencyGraphComponent from './components/DependencyGraphComponent';
import IndexComponent from './components/IndexComponent';

function App() {
  return (
    <div>
      <DependencyGraphComponent />
      <IndexComponent />
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById('root'));