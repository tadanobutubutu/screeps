import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

// Set the language attribute on the html element for accessibility
document.documentElement.lang = 'en';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);