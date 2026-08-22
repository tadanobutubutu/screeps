import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

// Ensure that the root element of the document has a lang attribute
document.documentElement.setAttribute('lang', 'en');

// Render the App component
ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);