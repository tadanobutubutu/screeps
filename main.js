import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './layout'; // Assuming layout.tsx has been modified and imported here

document.documentElement.lang = 'en';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);