/** @jsxImportSource react */
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'

// REACT_017 fix: Wrapped primary content in <main> landmark for screen reader accessibility
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <main>
      <App />
    </main>
  </React.StrictMode>
)

// Add favicon with accessible name
const favicon = document.createElement('link');
favicon.rel = 'icon';
favicon.href = '/favicon.ico';
favicon.type = 'image/x-icon';
favicon.setAttribute('aria-hidden', 'true'); // Mark as decorative if needed
document.head.appendChild(favicon);