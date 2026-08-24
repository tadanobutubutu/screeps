// Existing code in main.js that needs to be preserved

// New changes requested in the issue
// Since the issue is related to an HTML file, it does not directly affect the JavaScript in main.js.
// However, if there are any imports or exports related to the HTML file or any configuration that depends on it, those should remain unchanged.

// Example of how it might look if main.js imports or exports the HTML file:
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

// Example of configuration that might depend on the HTML file:
export const siteTitle = 'Screeps Documentation';

// No changes are necessary to the above code since it does not pertain to the lang attribute issue.