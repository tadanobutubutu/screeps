import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

// Accessibility fix functions
export function addLangAttribute() {
  document.documentElement.lang = 'en';
}

export function fixTableStructure() {
  const tables = document.querySelectorAll('table');
  tables.forEach(table => {
    if (!table.querySelector('thead') && table.querySelector('tr:first-child th')) {
      const thead = document.createElement('thead');
      const firstRow = table.querySelector('tr');
      if (firstRow) {
        thead.appendChild(firstRow.cloneNode(true));
        table.insertBefore(thead, table.firstChild);
      }
    }
  });
}

export function addMainLandmark() {
  const mainElements = document.querySelectorAll('main');
  if (mainElements.length === 0) {
    const main = document.createElement('main');
    const body = document.body;
    if (body.firstChild) {
      body.insertBefore(main, body.firstChild);
    } else {
      body.appendChild(main);
    }
  }
}

export function ensureUniqueLandmarks() {
  const landmarkRoles = ['banner', 'navigation', 'main', 'contentinfo', 'complementary', 'search'];
  landmarkRoles.forEach(role => {
    const landmarks = document.querySelectorAll(`[role="${role}"]`);
    if (landmarks.length > 1) {
      landmarks.forEach((landmark, index) => {
        if (index > 0) {
          landmark.removeAttribute(`role="${role}"`);
        }
      });
    }
  });
}

export function addSvgAccessibleNames() {
  const svgs = document.querySelectorAll('svg:not([aria-label])');
  svgs.forEach(svg => {
    const title = svg.querySelector('title');
    if (title) {
      svg.setAttribute('aria-label', title.textContent);
    }
  });
}

export function fixFakeLinkIssue() {
  const fakeLinks = document.querySelectorAll('a[href="#"], a[href=""], a:not([href])');
  fakeLinks.forEach(link => {
    if (link.getAttribute('href') === '#' || link.getAttribute('href') === '') {
      link.setAttribute('role', 'button');
    }
  });
}

// Initialize accessibility fixes
export function initAccessibility() {
  addLangAttribute();
  fixTableStructure();
  addMainLandmark();
  ensureUniqueLandmarks();
  addSvgAccessibleNames();
  fixFakeLinkIssue();
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

registerServiceWorker();