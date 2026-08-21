// Current main.js content
import React from 'react';
import ReactDOM from 'react-dom';

// ... (existing code)

ReactDOM.render(
  <React.StrictMode>
    {/* ... (existing JSX) */}
  </React.StrictMode>,
  document.getElementById('root')
);

// ... (existing code)

// Add the lang attribute to the root HTML element
document.documentElement.lang = 'en';