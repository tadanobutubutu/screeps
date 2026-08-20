import React from 'react';
import ReactDOM from 'react-dom';
import App from './App'; // Assuming your main component is named App

ReactDOM.render(
  <React.StrictMode>
    <html lang="en"> {/* Adding the lang attribute here */}
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Your App Name</title>
      </head>
      <body>
        <App />
      </body>
    </html>
  </React.StrictMode>,
  document.getElementById('root')
);