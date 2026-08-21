// Assuming main.js is a JavaScript file that imports the HTML files and uses them in the app.
import React from 'react';
import ReactDOM from 'react-dom';
import DependencyGraph from './docs/dependency-graph.html'; // This is a hypothetical import

ReactDOM.render(
  <React.StrictMode>
    <DependencyGraph />
  </React.StrictMode>,
  document.getElementById('root')
);