// TODO: Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (DONE: addLangAttribute)
// - REACT_027: Fix 26 table structure issues (DONE: fixTableStructure)
// - REACT_017: Add/fix 4 landmark issues (DONE: addMainLandmark)
// - REACT_025: Ensure unique landmarks (DONE: ensureUniqueLandmarks)
// - REACT_041: Add accessible names to 2 SVGs (DONE: addSvgAccessibleNames)
// - REACT_036: Fix 1 fake link issue (DONE: fixFakeLinkIssue)

import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

// REACT_015: Add lang attribute to HTML element
export const addLangAttribute = (document, lang = 'en') => {
  document.documentElement.lang = lang;
  return document.documentElement.lang;
};

// REACT_027: Fix table structure issues
export const fixTableStructure = (tableElement) => {
  if (!tableElement) return tableElement;
  
  const ensureTableHasCaption = (table) => {
    if (!table.querySelector('caption')) {
      const caption = document.createElement('caption');
      caption.style.clip = 'rect(0 0 0 0)';
      caption.style.position = 'absolute';
      table.prepend(caption);
    }
    return table;
  };

  const ensureTableHasHeaderCells = (table) => {
    const headers = table.querySelectorAll('th');
    if (headers.length === 0) {
      const firstRow = table.querySelector('tr');
      if (firstRow) {
        const cells = firstRow.querySelectorAll('td');
        cells.forEach(cell => {
          cell.setAttribute('scope', 'col');
        });
      }
    }
    return table;
  };

  const ensureProperTableStructure = (table) => {
    const hasThead = table.querySelector('thead');
    const hasTbody = table.querySelector('tbody');
    
    if (!hasThead) {
      const firstRow = table.querySelector('tr');
      if (firstRow) {
        const thead = document.createElement('thead');
        thead.appendChild(firstRow);
        table.prepend(thead);
      }
    }
    
    if (!hasTbody) {
      const rows = Array.from(table.querySelectorAll('tr'));
      const headerRow = table.querySelector('thead tr');
      const bodyRows = headerRow ? rows.filter(r => r !== headerRow) : rows;
      
      if (bodyRows.length > 0) {
        const tbody = document.createElement('tbody');
        bodyRows.forEach(row => tbody.appendChild(row));
        table.appendChild(tbody);
      }
    }
    
    return table;
  };

  return ensureProperTableStructure(ensureTableHasHeaderCells(ensureTableHasCaption(tableElement)));
};

// REACT_017: Add main landmark
export const addMainLandmark = (element) => {
  if (!element) return element;
  
  const existingMain = document.querySelector('main');
  if (!existingMain) {
    const main = document.createElement('main');
    main.setAttribute('id', 'main-content');
    main.setAttribute('role', 'main');
    
    while (element.firstChild) {
      main.appendChild(element.firstChild);
    }
    element.appendChild(main);
  }
  
  return element;
};

// REACT_025: Ensure unique landmarks
export const ensureUniqueLandmarks = (container) => {
  const landmarkRoles = ['banner', 'navigation', 'main', 'contentinfo', 'complementary', 'search'];
  
  landmarkRoles.forEach(role => {
    const landmarks = container.querySelectorAll(`[role="${role}"]`);
    
    if (role !== 'main' && landmarks.length > 1) {
      landmarks.forEach((landmark, index) => {
        if (index > 0) {
          landmark.removeAttribute(`aria-label`);
          const label = document.createElement('span');
          label.id = `landmark-label-${role}-${index}`;
          label.textContent = `${role} ${index + 1}`;
          label.style.position = 'absolute';
          label.style.width = '1px';
          label.style.height = '1px';
          label.style.overflow = 'hidden';
          label.style.clip = 'rect(0, 0, 0, 0)';
          landmark.setAttribute('aria-labelledby', label.id);
          landmark.prepend(label);
        }
      });
    }
  });
  
  return container;
};

// REACT_041: Add accessible names to SVGs
export const addSvgAccessibleNames = (svgElements) => {
  if (!svgElements || !Array.isArray(svgElements)) {
    svgElements = [svgElements].filter(Boolean);
  }
  
  svgElements.forEach((svg, index) => {
    if (!svg) return;
    
    // Remove existing aria-hidden to ensure screen readers can access the SVG
    svg.removeAttribute('aria-hidden');
    
    // Add accessible title if not present
    const existingTitle = svg.querySelector('title');
    if (!existingTitle) {
      const title = document.createElement('title');
      title.id = `svg-title-${index}`;
      title.textContent = `Icon ${index + 1}`;
      svg.prepend(title);
    }
    
    // Add role="img" if not present
    if (!svg.getAttribute('role')) {
      svg.setAttribute('role', 'img');
    }
    
    // Add aria-labelledby pointing to title
    const titleElement = svg.querySelector('title');
    if (titleElement && titleElement.id) {
      svg.setAttribute('aria-labelledby', titleElement.id);
    }
  });
  
  return svgElements;
};

// REACT_036: Fix fake link issue
export const fixFakeLinkIssue = (element) => {
  const fakeLinks = element.querySelectorAll('span[onclick], div[onclick], a:not([href])');
  
  fakeLinks.forEach(fakeLink => {
    const tagName = fakeLink.tagName.toLowerCase();
    const isClickable = fakeLink.hasAttribute('onclick') || fakeLink.style.cursor === 'pointer';
    
    if (isClickable && tagName !== 'a' && tagName !== 'button') {
      // Convert to proper button element
      const button = document.createElement('button');
      button.setAttribute('type', 'button');
      button.setAttribute('role', 'button');
      
      // Copy all attributes except tag-specific ones
      Array.from(fakeLink.attributes).forEach(attr => {
        if (attr.name !== 'onclick' || fakeLink.hasAttribute('href')) {
          button.setAttribute(attr.name, attr.value);
        }
      });
      
      // Copy onclick handler
      if (fakeLink.hasAttribute('onclick')) {
        button.setAttribute('onclick', fakeLink.getAttribute('onclick'));
      }
      
      // Copy inner content
      button.innerHTML = fakeLink.innerHTML;
      
      // Replace fake link with proper button
      fakeLink.parentNode.replaceChild(button, fakeLink);
    } else if (!fakeLink.hasAttribute('href') && tagName === 'a') {
      // If it's an anchor without href that should be a link, add proper href
      // Or if it should be a button, convert it
      if (!fakeLink.textContent && !fakeLink.querySelector('img')) {
        fakeLink.setAttribute('role', 'button');
      }
    }
  });
  
  return element;
};

// Initialize accessibility features
export const initializeAccessibility = () => {
  // Add lang attribute
  addLangAttribute(document, 'en');
  
  // Fix table structures
  document.querySelectorAll('table').forEach(table => {
    fixTableStructure(table);
  });
  
  // Add main landmark
  const appElement = document.getElementById('root');
  if (appElement) {
    addMainLandmark(appElement);
  }
  
  // Ensure unique landmarks
  ensureUniqueLandmarks(document.body);
  
  // Add SVG accessible names
  document.querySelectorAll('svg').forEach(svg => {
    addSvgAccessibleNames([svg]);
  });
  
  // Fix fake links
  fixFakeLinkIssue(document.body);
};

// Main App Component
function App() {
  return (
    <div className="App">
      <header role="banner">
        <nav role="navigation" aria-label="Main navigation">
          <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/about">About</a></li>
            <li><a href="/contact">Contact</a></li>
          </ul>
        </nav>
      </header>
      
      <main id="main-content" role="main">
        <h1>Welcome to Our Application</h1>
        
        <section aria-labelledby="section1-heading">
          <h2 id="section1-heading">Featured Content</h2>
          <p>This section contains featured content for our users.</p>
          
          <table>
            <thead>
              <tr>
                <th scope="col">Name</th>
                <th scope="col">Value</th>
                <th scope="col">Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Item 1</td>
                <td>100</td>
                <td>Active</td>
              </tr>
              <tr>
                <td>Item 2</td>
                <td>200</td>
                <td>Pending</td>
              </tr>
            </tbody>
          </table>
        </section>
        
        <section aria-labelledby="section2-heading">
          <h2 id="section2-heading">Resources</h2>
          <svg width="24" height="24" viewBox="0 0 24 24" role="img" aria-labelledby="icon1-title">
            <title id="icon1-title">Information icon</title>
            <circle cx="12" cy="12" r="10" fill="blue"/>
          </svg>
          
          <svg width="24" height="24" viewBox="0 0 24 24" role="img" aria-labelledby="icon2-title">
            <title id="icon2-title">Help icon</title>
            <rect x="4" y="4" width="16" height="16" fill="green"/>
          </svg>
          
          <button type="button" onClick={() => {}}>
            Click me (proper button)
          </button>
        </section>
      </main>
      
      <footer role="contentinfo">
        <p>&copy; 2024 Our Application</p>
      </footer>
    </div>
  );
}

// Render the app
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Initialize accessibility after render
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeAccessibility);
} else {
  initializeAccessibility();
}

export default App;