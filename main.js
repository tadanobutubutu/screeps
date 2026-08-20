import React, { useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

const root = ...

// Set the language attribute on the document for accessibility
if (typeof document !== 'undefined') {
  document.documentElement.lang = 'en';
}

root.render(
  <React.StrictMode>
    <main>
      <App />
    </main>
  </React.StrictMode>
);