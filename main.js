// Assuming the main.js file is responsible for rendering the HTML content, and it imports the root HTML element,
// here's how you might add the lang attribute to the <html> tag without altering the existing code structure.

import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';

ReactDOM.render(
  <React.StrictMode>
    {/* Add the lang attribute to the <html> tag */}
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Document</title>
      </head>
      <body>
        <App />
      </body>
    </html>
  </React.StrictMode>,
  document.getElementById('root')
);