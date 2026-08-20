// Assuming the main.js file is the entry point of the React application, it should be set up to render the root component of the app.
// Since the issue is about multiple <main> elements, we need to ensure that there is only one <main> element in the entire application.

import React from 'react';
import ReactDOM from 'react-dom';
import App from './App'; // Assuming the root component is exported from a file named 'App'

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);