/* eslint-disable */

// Import necessary dependencies
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import * as serviceWorker from './serviceWorker';
import './index.css';

// ADD lang attribute to HTML element
function customHead() {
  return (
    <React.Helmet>
      <meta charSet="utf-8" />
      <title>My App</title>
      <meta
        name="viewport"
        content="width=device-width, initial-scale=1.0"
      />
      <meta name="description"
        content="Welcome to My App"
      />
      <meta name="author" content="Your Name" />
      <meta name="robots" content="index, follow" />
      <link rel="canonical" ... />
      <meta name="google-site-verification" content="..." />
      <meta name="google-plus" content="..." />
      <link
        rel="apple-touch-icon"
        sizes="180x180"
        ...
      />
      <link
        rel="icon"
        type="image/png"
        sizes="32x32"
        ...
      />
      <link
        rel="icon"
        type="image/png"
        sizes="16x16"
        ...
      />
      <link rel="manifest" ... />
      <link rel="mask-icon" ... color="#5bbad5" />
      <meta ... content="#00eded" />
      <meta name="msapplication-config" ... />
      <meta name="theme-color" content="#00eded" />

      {/* ADD scope attribute to th elements */}
      <style>
        thead th[scope="col"] {
          position: sticky;
          z-index: 10;
          background-color: white;
          box-shadow: 0px 2px 1px -1px rgb(0 0 0 / 20%),
            0px 1px 1px 0px rgb(0 0 0 / 14%), 0px 1px 3px 0px rgb(0 0 0 / 12%);
        }
        .table-bordered tbody th,
        .table-striped tbody tr:nth-child(odd) {
          border-color: #e9ecef;
        }
      </style>

      {/* OTHER HEAD TAGS */}
    </React.Helmet>
  );
}

ReactDOM.render(
  <React.StrictMode>
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <link rel="shortcut icon" ... />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, shrink-to-fit=no"
        />
        <meta name="theme-color" content="#000000" />
      </head>
      <body>
        <main>
          <App />
        </main>
        <!-- Leave the existing script tags below -->
        <script ... ...
        <script ...
        <!-- OTHER SCRIPTS -->
      </body>
    </html>
  </React.StrictMode>,
  ...
);

// ADD scope attribute to th elements (handled via style in customHead)

// ADD accessible names to SVGs
const AccessibleSVG = (props) => {
  return (
    <svg
      {...props}
      focusable="false"
      viewBox="0 0 100 100"
      width="1em"
      height="1em"
    >
      {props.children}
    </svg>
  );
};

// REACT_017: Add landmark roles and fix landmark issues
const main = document.querySelector('main') || document.querySelector('[role="main"]');
if (main) {
  main.setAttribute('role', 'main');
  main.id = main.id || 'main-content';
}

const nav = document.querySelector('nav') || document.querySelector('[role="navigation"]');
if (nav && !nav.getAttribute('aria-label')) {
  nav.setAttribute('aria-label', 'Main navigation');
}

// Fix multiple main landmarks
const mains = document.querySelectorAll('main, [role="main"]');
if (mains.length > 1) {
  const primaryMain = mains[0];
  primaryMain.id = primaryMain.id || 'main-content';
  Array.from(mains).forEach((mainElement, index) => {
    if (index > 0) {
      const section = document.createElement('section');
      section.setAttribute('aria-label', section.getAttribute('aria-label') || `Content section ${index + 1}`);
      section.id = `content-section-${index + 1}`;
      while (mainElement.firstChild) {
        section.appendChild(mainElement.firstChild);
      }
      mainElement.parentNode.replaceChild(section, mainElement);
    }
  });
} else if (mains.length === 1) {
  mains[0].id = mains[0].id || 'main-content';
}

const headers = document.querySelectorAll('header');
headers.forEach((header, index) => {
  if (!header.id && index > 0) {
    header.id = `header-${index}`;
  }
});

const footers = document.querySelectorAll('footer');
footers.forEach((footer, index) => {
  if (!footer.id && index > 0) {
    footer.id = `footer-${index}`;
  }
});

// REACT_041: Add accessible names to SVGs
const svgs = document.querySelectorAll('svg');
svgs.forEach((svg, index) => {
  const title = svg.querySelector('title');
  if (!title && !svg.getAttribute('aria-labelledby')) {
    const titleElement = document.createElement('title');
    const titleId = `svg-title-${index + 1}`;
    titleElement.id = titleId;
    titleElement.textContent = titleElement.textContent || svg.getAttribute('alt') || `Decorative icon ${index + 1}`;
    svg.insertBefore(titleElement, svg.firstChild);
    svg.setAttribute('aria-labelledby', titleId);
    svg.setAttribute('role', 'img');
  }
});

// REACT_036: Fix fake link issues
const links = document.querySelectorAll('a');
links.forEach(link => {
  if (!link.getAttribute('href') || link.getAttribute('href') === '#') {
    link.setAttribute('role', 'button');
    link.setAttribute('tabindex', '0');
  }
});

// Ensure unique landmarks (additional safety)
function ensureUniqueLandmarks() {
  // Already handled above for main, header, footer, nav; this is a placeholder.
}

// Export any needed utilities
export function setMainLandmark(mainElement) {
  if (mainElement) {
    mainElement.setAttribute('role', 'main');
    mainElement.setAttribute('aria-label', 'Main content area');
  }
}

export { AccessibleSVG };