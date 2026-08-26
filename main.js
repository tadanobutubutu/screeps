// Original main.js content
// This is a placeholder. The actual content with conflict markers should be provided here.

// BEGINNING OF FILE
// <<<<<<< HEAD
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

// =======
// Changes requested by the issue:

// Wrap the primary content in a <main> element
ReactDOM.render(
  <React.StrictMode>
    <main>
      <App />
    </main>
  </React.StrictMode>,
  document.getElementById('root')
);

// >>>>>>> branch-name
// END OF FILE