// Updated main.js to include main landmark for accessibility (REACT_017) and placed a placeholder for accessibility-related code changes as requested in the insight report.
import React from 'react';
import ReactDOM from 'react-dom';
import { SemanticHTMLFactory, useLandmarks } from '@microsoft/fast-components-react-msft';

const MainLandmark = SemanticHTMLFactory.create('main');

function App() {
  const { main } = useLandmarks();

  return (
    <>
      <MainLandmark landmark="main">
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
      </MainLandmark>
    </>
  );
}

ReactDOM.render(<App />, document.getElementById('root'));