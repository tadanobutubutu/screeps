// Main entry point — REACT_017 fix: added <main> landmark for accessibility
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <main>
      <App />
    </main>
  </React.StrictMode>
);