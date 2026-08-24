// Existing code from main.js
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

// Adding the lang attribute to the root element in the HTML file
// This is typically done in the HTML template file, not in the JavaScript file
// Below is a representation of how you would add the lang attribute in the HTML file, not to be used in JavaScript

/*
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Document</title>
</head>
<body>
  <div id="root"></div>
  // ... rest of the HTML file
</body>
</html>
*/