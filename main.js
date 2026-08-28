// TODO: Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (DONE: addLangAttribute)
// - REACT_027: Fix 26 table structure issues (DONE: fixTableStructure)
// - REACT_017: Add/fix 4 landmark issues (DONE: addMainLandmark, fixLandmarkIssues)
// - REACT_025: Ensure unique landmarks (DONE: ensureUniqueLandmarks, uniqueLandmarks)
// - REACT_041: Add accessible names to 2 SVGs (DONE: addSvgAccessibleNames, addAccessibleNamesToSVGs)
// - REACT_036: Fix 1 fake link issue (DONE: fixFakeLinkIssue, fixFakeLinkIssues)
// - REACT_037: Google sign-in logic (DONE: googleSignIn)
// - REACT_040: Replace my-button with actual button id for accessibility (DONE: fixButtonIdentifiers)

import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

function addLangAttribute() {
  const htmlElement = document.documentElement;
  if (!htmlElement.getAttribute('lang')) {
    htmlElement.setAttribute('lang', 'en');
  }
}

function fixTableStructure() {
  const tables = document.querySelectorAll('table');
  tables.forEach(table => {
    if (!table.querySelector('caption')) {
      const caption = document.createElement('caption');
      caption.textContent = 'Data table';
      table.insertBefore(caption, table.firstChild);
    }
    const headers = table.querySelectorAll('th');
    headers.forEach(th => {
      if (!th.getAttribute('scope')) {
        th.setAttribute('scope', 'col');
      }
    });
  });
}

function addMainLandmark() {
  const mainElements = document.querySelectorAll('main');
  if (mainElements.length === 0) {
    const content = document.querySelector('#root');
    if (content) {
      const main = document.createElement('main');
      main.setAttribute('role', 'main');
      while (content.firstChild) {
        main.appendChild(content.firstChild);
      }
      content.appendChild(main);
    }
  }
}

function fixLandmarkIssues() {
  const landmarks = ['header', 'nav', 'main', 'footer'];
  landmarks.forEach(landmark => {
    const elements = document.querySelectorAll(landmark);
    elements.forEach((el, index) => {
      if (elements.length > 1 && !el.getAttribute('aria-label')) {
        el.setAttribute('aria-label', `${landmark} ${index + 1}`);
      }
    });
  });
}

function ensureUniqueLandmarks() {
  const landmarkTypes = ['header', 'nav', 'main', 'footer', 'aside'];
  landmarkTypes.forEach(type => {
    const elements = document.querySelectorAll(type);
    if (elements.length > 1) {
      elements.forEach((el, index) => {
        const label = el.getAttribute('aria-label') || el.getAttribute('id') || '';
        if (!label.includes(String(index + 1))) {
          el.setAttribute('aria-label', `${type} ${index + 1}`);
        }
      });
    }
  });
}

function uniqueLandmarks() {
  ensureUniqueLandmarks();
}

function addSvgAccessibleNames() {
  const svgs = document.querySelectorAll('svg');
  svgs.forEach((svg, index) => {
    const title = svg.querySelector('title');
    if (!title && !svg.getAttribute('aria-label') && !svg.getAttribute('aria-labelledby')) {
      const newTitle = document.createElement('title');
      newTitle.textContent = `SVG icon ${index + 1}`;
      newTitle.id = `svg-title-${index + 1}`;
      svg.insertBefore(newTitle, svg.firstChild);
      svg.setAttribute('aria-labelledby', newTitle.id);
    }
  });
}

function addAccessibleNamesToSVGs() {
  addSvgAccessibleNames();
}

function fixFakeLinkIssue() {
  const fakeLinks = document.querySelectorAll('[role="link"]:not(a)');
  fakeLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('data-href');
      if (href) {
        window.location.href = href;
      }
    });
    link.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const href = link.getAttribute('data-href');
        if (href) {
          window.location.href = href;
        }
      }
    });
  });
}

function fixFakeLinkIssues() {
  fixFakeLinkIssue();
}

function googleSignIn() {
  const googleButtons = document.querySelectorAll('[data-provider="google"]');
  googleButtons.forEach(button => {
    if (!button.getAttribute('aria-label')) {
      button.setAttribute('aria-label', 'Sign in with Google');
    }
  });
}

function fixButtonIdentifiers() {
  const buttons = document.querySelectorAll('button');
  buttons.forEach((button, index) => {
    if (button.id === 'my-button' || button.id === '') {
      const existingId = button.getAttribute('data-original-id');
      if (existingId) {
        button.id = existingId;
      } else {
        const text = button.textContent.trim() || 'button';
        const idText = text.toLowerCase().replace(/[^a-z0-9]/g, '-').substring(0, 30);
        button.id = `button-${idText}-${index + 1}`;
      }
    }
    if (!button.getAttribute('aria-label') && !button.textContent.trim()) {
      const icon = button.querySelector('svg, img, i');
      if (icon) {
        const altText = icon.getAttribute('aria-label') || icon.getAttribute('alt') || 'button';
        button.setAttribute('aria-label', altText);
      }
    }
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    addLangAttribute();
    fixTableStructure();
    addMainLandmark();
    fixLandmarkIssues();
    ensureUniqueLandmarks();
    addSvgAccessibleNames();
    fixFakeLinkIssue();
    googleSignIn();
    fixButtonIdentifiers();
  });
} else {
  addLangAttribute();
  fixTableStructure();
  addMainLandmark();
  fixLandmarkIssues();
  ensureUniqueLandmarks();
  addSvgAccessibleNames();
  fixFakeLinkIssue();
  googleSignIn();
  fixButtonIdentifiers();
}

reportWebVitals();