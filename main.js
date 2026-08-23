import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Get the language from the document or default to 'en'
const lang = document.documentElement.lang || 'en';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);