import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

// Accessibility enhancements
const myButton = ...

// If myButton exists, let's make it accessible
if (myButton) {
  ... 'Click the button');
}

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  ...
);