import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

// Adding the lang attribute to the root HTML element
if (document.head) {
  const htmlTag = document.head.querySelector('html');
  if (htmlTag) {
    htmlTag.setAttribute('lang', 'en');
  }
}