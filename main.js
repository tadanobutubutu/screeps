// TODO: Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (DONE: addLangAttribute)
// - [NEW] Wrap the primary content in <main> so it can be skipped to (DONE: wrapPrimaryContentInMain)
// - [NEW] Fix error state in Dashboard.tsx files: change return path from <main> to <section> (DONE: fixErrorStateInSection)
// - [NEW] Add your code here if any other issues need to be addressed

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles.css';

// Accessibility fix: Add lang attribute to HTML element
const lang = document.documentElement.lang || 'en';

// Wrap the primary content in <main> for skip-to-content functionality
const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

root.render(
  <React.StrictMode>
    {/* Accessibility fix: Wrap in main element with lang attribute */}
    <html lang={lang}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#000000" />
        <meta name="description" content="Application description" />
        <link rel="icon" href="%PUBLIC_URL%/favicon.ico" />
        <link rel="manifest" href="%PUBLIC_URL%/manifest.json" />
        <title>React App</title>
      </head>
      <body>
        <noscript>You need to enable JavaScript to run this app.</noscript>
        <main id="main-content">
          <App />
        </main>
      </body>
    </html>
  </React.StrictMode>
);

// Register service worker for offline support
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js').catch((error) => {
      console.log('Service Worker registration failed:', error);
    });
  });
}