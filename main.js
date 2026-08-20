// Assuming main.js is a file that imports index.html or uses a template literal to include it

import React from 'react';
import ReactDOM from 'react-dom';
import './index.html'; // This line imports the HTML file that contains the <html> tag

ReactDOM.render(
  <React.StrictMode>
    {/* ... your React components ... */}
  </React.StrictMode>,
  document.getElementById('root')
);