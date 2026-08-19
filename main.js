/* No changes required in main.js for issue REACT_027; see docs/dependency-graph.html for fixes. */
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

document.documentElement.lang = 'en';