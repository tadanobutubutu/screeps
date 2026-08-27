// Assuming main.js is a JavaScript file that imports and uses the HTML content from 'docs/dependency-graph.html'
import React from 'react';
import ReactDOM from 'react-dom';
import './docs/dependency-graph.html'; // This is a hypothetical import to illustrate the concept

// Example component that uses the HTML content
function DependencyGraph() {
  return (
    <div>
      {/* Render the HTML content from 'docs/dependency-graph.html' */}
      {/* ... */}
    </div>
  );
}

ReactDOM.render(<DependencyGraph />, document.getElementById('root'));