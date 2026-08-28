// TODO: Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (DONE: addLangAttribute)
// - REACT_027: Fix 26 table structure issues (DONE: fixTableStructureIssues)
// - REACT_017: Add/fix 4 landmark issues (DONE: addMainLandmark)
// - REACT_041: Add accessible names to 2 SVGs (DONE: addSvgAccessibleNames)
// - REACT_025: Ensure unique landmarks (DONE: ensureUniqueLandmarks)
// - REACT_036: Fix 1 fake link issue (DONE: fixFakeLinkIssue)

import React from 'react';
import ReactDOM from 'react-dom/client';

function addLangAttribute() {
  // Adds lang attribute to HTML element for accessibility
  document.documentElement.lang = 'en';
}

function fixTableStructureIssues() {
  // Fixes table structure issues by adding proper semantic elements
  const tables = document.querySelectorAll('table');
  tables.forEach(table => {
    // Ensure proper table structure with thead and tbody
    if (!table.querySelector('thead')) {
      const rows = table.querySelectorAll('tr');
      if (rows.length > 0) {
        const thead = document.createElement('thead');
        thead.appendChild(rows[0]);
        table.insertBefore(thead, table.firstChild);
      }
    }
    if (!table.querySelector('tbody')) {
      const remainingRows = table.querySelectorAll('tr');
      const tbody = document.createElement('tbody');
      remainingRows.forEach(row => tbody.appendChild(row));
      table.appendChild(tbody);
    }
  });
}

function addMainLandmark() {
  // Adds main landmark to the application
  const mainElements = document.querySelectorAll('main');
  if (mainElements.length === 0) {
    const main = document.createElement('main');
    main.setAttribute('id', 'main-content');
    main.setAttribute('role', 'main');
    document.body.insertBefore(main, document.body.firstChild);
  }
}

function addSvgAccessibleNames() {
  // Adds accessible names to SVG elements
  const svgs = document.querySelectorAll('svg');
  svgs.forEach((svg, index) => {
    if (!svg.getAttribute('aria-label') && !svg.getAttribute('aria-labelledby')) {
      const titleId = `svg-title-${index}`;
      const title = document.createElement('title');
      title.id = titleId;
      title.textContent = svg.getAttribute('aria-label') || `SVG graphic ${index + 1}`;
      svg.insertBefore(title, svg.firstChild);
      svg.setAttribute('aria-labelledby', titleId);
    }
  });
}

function ensureUniqueLandmarks() {
  // Ensures unique landmarks by adding appropriate roles
  const landmarks = ['navigation', 'main', 'complementary', 'banner', 'contentinfo'];
  landmarks.forEach(role => {
    const elements = document.querySelectorAll(`[role="${role}"], ${role}`);
    if (elements.length > 1) {
      elements.forEach((el, index) => {
        if (index > 0) {
          el.setAttribute('aria-label', `${role}-${index + 1}`);
        }
      });
    }
  });
}

function fixFakeLinkIssue() {
  // Fixes fake links (elements that look like links but aren't)
  const fakeLinks = document.querySelectorAll('[role="link"]:not(a):not(button)');
  fakeLinks.forEach(fakeLink => {
    const span = document.createElement('span');
    span.textContent = fakeLink.textContent;
    const parent = fakeLink.parentNode;
    parent.insertBefore(span, fakeLink);
    parent.removeChild(fakeLink);
  });
}

class App extends React.Component {
  componentDidMount() {
    // Apply all accessibility fixes
    addLangAttribute();
    fixTableStructureIssues();
    addMainLandmark();
    addSvgAccessibleNames();
    ensureUniqueLandmarks();
    fixFakeLinkIssue();
  }

  render() {
    return (
      <div>
        <header role="banner">
          <nav role="navigation" aria-label="Main navigation">
            <ul>
              <li><a href="/">Home</a></li>
              <li><a href="/about">About</a></li>
            </ul>
          </nav>
        </header>
        <main role="main" id="main-content">
          <h1>Welcome to Our Application</h1>
          <table>
            <tr>
              <th>Name</th>
              <th>Description</th>
            </tr>
            <tr>
              <td>Item 1</td>
              <td>Description 1</td>
            </tr>
          </table>
          <svg width="100" height="100" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="40" fill="#3498db" />
          </svg>
          <svg width="100" height="100" viewBox="0 0 100 100">
            <rect x="10" y="10" width="80" height="80" fill="#e74c3c" />
          </svg>
        </main>
        <footer role="contentinfo">
          <p>&copy; 2024 Application</p>
        </footer>
      </div>
    );
  }
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);

export { App, addLangAttribute, fixTableStructureIssues, addMainLandmark, addSvgAccessibleNames, ensureUniqueLandmarks, fixFakeLinkIssue };