// main.js
import React from 'react';
import ReactDOM from 'react-dom';

// Import the root component that wraps the rest of your application
import App from './App';

ReactDOM.render(
  <React.StrictMode>
    {/* Wrap your app with the App component */}
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

// Additional code may be here

// Example of a component that includes the <html> tag with the lang attribute
ReactDOM.render(
  <html lang="en">
    <head>
      <title>Your Application</title>
    </head>
    <body>
      {/* The rest of your application */}
      <App />
    </body>
  </html>,
  document.getElementById('root')
);