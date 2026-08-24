import React from 'react';
import ReactDOM from 'react-dom/client';

// Helper function to add lang attribute to HTML element
function addLangAttribute(lang = 'en') {
  document.documentElement.lang = lang;
}

// Helper function to fix table structure issues
function fixTableStructure(tableElement) {
  if (!tableElement) return;
  
  // Ensure proper table structure: thead, tbody, tfoot
  const hasThead = tableElement.querySelector('thead');
  const hasTbody = tableElement.querySelector('tbody');
  
  if (!hasTbody) {
    const rows = Array.from(tableElement.querySelectorAll('tr'));
    const tbody = document.createElement('tbody');
    rows.forEach(row => tbody.appendChild(row));
    tableElement.appendChild(tbody);
  }
  
  // Ensure proper scope attributes on header cells
  const headers = tableElement.querySelectorAll('th');
  headers.forEach(th => {
    if (!th.getAttribute('scope')) {
      const row = th.parentElement;
      const headerIndex = Array.from(row.children).indexOf(th);
      const isRowHeader = row.querySelectorAll('th').length > 1 && headerIndex === 0;
      th.setAttribute('scope', isRowHeader ? 'row' : 'col');
    }
  });
  
  return tableElement;
}

// Helper function to add main landmark
function addMainLandmark(mainElement) {
  if (!mainElement) return;
  
  mainElement.setAttribute('role', 'main');
  if (!mainElement.id) {
    mainElement.id = 'main-content';
  }
  
  return mainElement;
}

// Helper function to validate landmark
function validateLandmark(element, expectedRole, expectedLabel = null) {
  if (!element) return false;
  
  const role = element.getAttribute('role');
  if (role !== expectedRole) return false;
  
  if (expectedLabel) {
    const label = element.getAttribute('aria-label');
    return label === expectedLabel;
  }
  
  return true;
}

// Helper function to validate landmark structure
function validateLandmarkStructure(container) {
  const issues = [];
  
  // Check for banner landmark (should be exactly one)
  const banners = container.querySelectorAll('[role="banner"]');
  if (banners.length !== 1) {
    issues.push({ type: 'banner', count: banners.length, expected: 1 });
  }
  
  // Check for main landmark (should be exactly one)
  const mains = container.querySelectorAll('[role="main"], main');
  if (mains.length !== 1) {
    issues.push({ type: 'main', count: mains.length, expected: 1 });
  }
  
  // Check for contentinfo landmark (should be exactly one)
  const contentinfos = container.querySelectorAll('[role="contentinfo"]');
  if (contentinfos.length !== 1) {
    issues.push({ type: 'contentinfo', count: contentinfos.length, expected: 1 });
  }
  
  // Check navigation landmarks have accessible names
  const navigations = container.querySelectorAll('nav');
  navigations.forEach((nav, index) => {
    const label = nav.getAttribute('aria-label');
    if (!label) {
      issues.push({ type: 'nav-missing-label', index });
    }
  });
  
  return issues;
}

// Helper function to ensure unique landmarks
function ensureUniqueLandmarks(container) {
  const landmarkRoles = ['banner', 'main', 'contentinfo', 'navigation', 'complementary'];
  const issues = [];
  
  landmarkRoles.forEach(role => {
    const elements = container.querySelectorAll(`[role="${role}"]`);
    if (elements.length > 1) {
      issues.push({ role, count: elements.length });
    }
  });
  
  return issues;
}

// Helper function to fix fake link issue
function fixFakeLinkIssue(linkElement, onClickHandler, accessibleName) {
  if (!linkElement) return null;
  
  // Replace fake link with accessible button
  return createInPageButton(linkElement.textContent, onClickHandler, accessibleName);
}

// Helper function to create in-page button
function createInPageButton(label, onClickHandler, accessibleName = null) {
  const button = document.createElement('button');
  button.type = 'button';
  button.textContent = label;
  
  if (accessibleName) {
    button.setAttribute('aria-label', accessibleName);
  }
  
  if (onClickHandler) {
    button.addEventListener('click', onClickHandler);
  }
  
  return button;
}

// Helper function to create accessible link
function createAccessibleLink(href, label, isExternal = false, isDownload = false) {
  const link = document.createElement('a');
  link.href = href;
  link.textContent = label;
  
  if (isExternal) {
    link.setAttribute('target', '_blank');
    link.setAttribute('rel', 'noopener noreferrer');
  }
  
  if (isDownload) {
    link.setAttribute('download', '');
  }
  
  return link;
}

function App() {
  return (
    <div>
      <header role="banner">
        <nav role="navigation" aria-label="Main navigation">
          <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/about">About</a></li>
            <li><button type="button">Contact</button></li>
          </ul>
        </nav>
      </header>

      <main role="main" id="main-content">
        <h1>Welcome to our Application</h1>

        {/* Accessible SVG example */}
        <svg 
          width="100" 
          height="100" 
          viewBox="0 0 100 100" 
          role="img" 
          aria-label="Decorative logo icon"
        >
          <title>Company Logo Icon</title>
          <circle cx="50" cy="50" r="40" fill="#3498db" />
        </svg>

        {/* Another accessible SVG */}
        <svg 
          width="24" 
          height="24" 
          viewBox="0 0 24 24" 
          role="img" 
          aria-hidden="true"
        >
          <title>Close Menu</title>
          <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 13.41 12z" />
        </svg>

        <p>Click the button below to get started.</p>

        {/* Fixed fake link - using button instead */}
        <button type="button" onClick={() => console.log('Action triggered')}>
          Start Now
        </button>
      </main>

      <footer role="contentinfo">
        <nav role="navigation" aria-label="Footer navigation">
          <ul>
            <li><a href="/privacy">Privacy Policy</a></li>
            <li><a href="/terms">Terms of Service</a></li>
          </ul>
        </nav>
      </footer>
    </div>
  );
}

// Set language attribute on the HTML element
addLangAttribute('en');

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Export App component
export default App;