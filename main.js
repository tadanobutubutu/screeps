import React from 'react';
import ReactDOM from 'react-dom';
import App from './App'; // Import the App component which should include the <main> landmark

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);