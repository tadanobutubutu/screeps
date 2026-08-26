import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

// Accessibility enhancements
const myButton = document.getElementById('actual-button-id');

// If myButton exists, let's make it accessible
if (myButton) {
  myButton.setAttribute('aria-label', 'Click the button');
}

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);