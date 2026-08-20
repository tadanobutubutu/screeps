import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Adding the lang attribute to the document's root element
document.documentElement.lang = 'en';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);