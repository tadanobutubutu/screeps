import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './index.css';

ReactDOM.render(
  <React.StrictMode>
    <html lang="en">
      <body>
        {/* Adding the aria-hidden="true" attribute to hide the SVG from assistive technologies */}
        <svg aria-hidden="true" width="32" height="32" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
          {/* ... SVG content here ... */}
        </svg>
        <App />
      </body>
    </html>
  </React.StrictMode>,
  document.getElementById('root')
);