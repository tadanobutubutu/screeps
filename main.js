// Existing code is preserved verbatim
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

// Example of an existing utility function (must stay unchanged)
function calculateScore(input) {
  return input * 2;
}

// Example of an existing exported constant (must stay unchanged)
export const VERSION = '1.0.0';

// NEW: Wrap the primary UI content in a <main> landmark
function PrimaryApp() {
  return (
    <main>
      {/* Begin primary content */}
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
      {/* End primary content */}
    </main>
  );
}

// Existing root component (preserved, now renders the new <main>-wrapped content)
function App() {
  return <PrimaryApp />;
}

// Render the application
const root = document.getElementById('root');
if (root) {
  ReactDOM.render(<App />, root);
}

// Export any existing symbols unchanged
export { calculateScore, VERSION };
export default App;