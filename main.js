import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

ReactDOM.render(
  <React.StrictMode>
    <html lang="en">
      <head>
        {/* existing head content */}
      </head>
      <body>
        <App />
      </body>
    </html>
  </React.StrictMode>,
  document.getElementById('root')
);