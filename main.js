// Assuming 'docs/dependency-graph.html' and 'docs/index.html' are available as React components
import React from 'react';
import ReactDOM from 'react-dom';
import DependencyGraph from './docs/dependency-graph.html';
import IndexPage from './docs/index.html';

function App() {
  return (
    <div>
      <main>
        <DependencyGraph />
      </main>
      <main>
        <IndexPage />
      </main>
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById('root'));