/* eslint-disable */

// Import necessary dependencies
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import * as serviceWorker from './serviceWorker';
import './index.css';

// ADD lang attribute to HTML element
ReactDOM.render(
  <React.StrictMode>
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <link rel="shortcut icon" href="%PUBLIC_URL%/favicon.ico" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, shrink-to-fit=no"
        />
        <meta name="theme-color" content="#000000" />
      </head>
      <body>
        <App />
        <!-- Leave the existing script tags below -->
        <script src="%PUBLIC_URL%/react-Async-plugin.min.js"></script>
        <script src="%PUBLIC_URL%/react-helmet-async.browser.min.js"></script>
        <!-- OTHER SCRIPTS -->
      </body>
    </html>
  </React.StrictMode>,
  document.getElementById('root')
);

// Ensure unique landmarks
// Check your HTML structure to ensure that there's only one <main>, <nav>, <aside>, <footer>, <header> elements.

// Fix 1 fake link issue
// Locate and modify the code that creates the fake link to a valid <a> tag.

// No need to change the export lines or the serviceWorker line, as they are not related to the accessibility issues.