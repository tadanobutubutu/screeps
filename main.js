import 'core-js/stable';
import 'regenerator-runtime/runtime';
import 'polyfill-io/stable';
import ...
import 'polyfill-foss/all'; // import polyfill for IE11
import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import Header from './components/Header';
import Main from './components/Main';
import Footer from './components/Footer';
import './styles.css';

// Initial setup
const app = document.getElementById('root');

// Improve accessibility
app.setAttribute('role', 'main');
app.setAttribute('aria-label', 'Main application');

// New function to add lang attribute to the HTML element
const addLangAttribute = () => {
  const htmlElement = document.documentElement;
  if (!htmlElement.getAttribute('lang')) {
    htmlElement.setAttribute('lang', 'en');
  }
};

// New function to fix table structure issues
const fixTableStructure = () => {
  const tables = document.querySelectorAll('table');
  tables.forEach(table => {
    if (!table.getAttribute('role')) {
      table.setAttribute('role', 'table');
    }

    // Check if table has proper headers
    const headers = table.querySelectorAll('th');
    const rows = table.querySelectorAll('tr');

    if (headers.length > 0 && rows.length > 0) {
      headers.forEach(header => {
        if (!header.getAttribute('scope')) {
          // Determine if it's a column or row header
          const parentRow = header.parentElement;
          const headerIndex = Array.from(parentRow.children).indexOf(header);
          const firstCell = rows[0].children[headerIndex];

          if (firstCell === header) {
            header.setAttribute('scope', 'col');
          } else {
            header.setAttribute('scope', 'row');
          }
        }
      });
    }
  });
};

function function3() {
  // TODO: Implement new function3 logic here
}

function App() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const response = await fetch('/api/data');
      const result = await response.json();
      setData(result);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    document.documentElement.setAttribute('lang', 'en');
    fetchData();
    
    // Run accessibility enhancements
    addLangAttribute();
    fixTableStructure();
    addMainLandmark();
    ensureUniqueLandmarks();
    addSvgAccessibleNames();
    fixFakeLinkIssue();
    validateLandmark();
    addCustomValidation();
  }, []);

  // REACT_015 & REACT_017: Ensure document has lang attribute and proper landmark structure
  return (
    <div className="app-container">
      <Header />
      <Main data={data} loading={loading} />
      <Footer />
    </div>
  );
}

export function getUniqueLandmarkName(baseName, existingNames) {
  if (!existingNames.includes(baseName)) {
    return baseName;
  }
  let counter = 2;
  let newName = `${baseName}-${counter}`;
  while (existingNames.includes(newName)) {
    counter++;
    newName = `${baseName}-${counter}`;
  }
  return newName;
}

export function validateUniqueLandmarks(container) {
  const landmarks = container.querySelectorAll('[role="banner"], [role="navigation"], [role="main"], [role="contentinfo"], header, nav, main, footer');
  const landmarkNames = new Set();
  const issues = [];

  landmarks.forEach((landmark) => {
    const ariaLabel = landmark.getAttribute('aria-label');
    const ariaLabelledby = landmark.getAttribute('aria-labelledby');
    const tagName = landmark.tagName.toLowerCase();

    // Determine the landmark name
    let landmarkName = ariaLabel || ariaLabelledby || tagName;

    if (landmarkNames.has(landmarkName)) {
      issues.push({
        element: landmark,
        message: `Duplicate landmark found: "${landmarkName}". Use unique aria-label or aria-labelledby.`,
        severity: 'warning'
      });
    } else {
      landmarkNames.add(landmarkName);
    }
  });

  return issues;
}

// New function to add/fix landmark issues
const addMainLandmark = () => {
  let mainElement = document.querySelector('main');

  if (!mainElement) {
    mainElement = document.createElement('main');
    mainElement.setAttribute('id', 'main');

    const body = document.body;
    if (body && body.firstChild) {
      body.insertBefore(mainElement, body.firstChild);
    } else if (body) {
      body.appendChild(mainElement);
    }
  } else if (!mainElement.id) {
    mainElement.setAttribute('id', 'main');
  }
};

// New function to ensure unique landmarks
const ensureUniqueLandmarks = () => {
  const landmarks = ['main', 'navigation', 'search', 'contentinfo', 'complementary', 'form', 'region'];

  landmarks.forEach(landmark => {
    const elements = document.querySelectorAll(`[role="${landmark}"], ${landmark}`);
    const seen = new Set();

    elements.forEach(element => {
      let id = element.id;

      if (!id) {
        let generatedId;
        let counter = 0;

        do {
          generatedId = `${landmark}-${counter}`;
          counter++;
        } while (seen.has(generatedId));

        id = generatedId;
      }

      // Ensure uniqueness across all landmarks of the same type
      while (seen.has(id)) {
        let baseId = id;
        let suffix = 1;

        while (seen.has(`${baseId}-${suffix}`)) {
          suffix++;
        }

        id = `${baseId}-${suffix}`;
      }

      seen.add(id);
      element.setAttribute('id', id);
    });
  });
};

// New function to add accessible names to SVGs
const addSvgAccessibleNames = () => {
  const svgs = document.querySelectorAll('svg');

  svgs.forEach((svg, index) => {
    const ariaLabel = svg.getAttribute('aria-label') ||
                      svg.getAttribute('aria-labelledby') ||
                      svg.querySelector('title')?.textContent;

    if (!ariaLabel) {
      svg.setAttribute('role', 'img');
      svg.setAttribute('aria-label', `SVG Icon ${index + 1}`);
    } else {
      svg.setAttribute('role', 'img');
    }
  });
};

// New function to fix fake link issues
const fixFakeLinkIssue = () => {
  const links = document.querySelectorAll('a');

  links.forEach(link => {
    const href = link.getAttribute('href');

    if (!href || href === '#' || href === '') {
      link.setAttribute('role', 'link');
      link.setAttribute('href', '#');
    }
  });
};

// Function to check link and button accessibility
const checkLinksAndButtonsAccessibility = () => {
  const results = {
    links: {
      total: 0,
      accessible: 0,
      issues: []
    },
    buttons: {
      total: 0,
      accessible: 0,
      issues: []
    }
  };

  // Check all links
  const links = document.querySelectorAll('a');
  results.links.total = links.length;

  links.forEach((link, index) => {
    const href = link.getAttribute('href');
    const textContent = link.textContent.trim();
    const ariaLabel = link.getAttribute('aria-label');
    const ariaLabelledby = link.getAttribute('aria-labelledby');
    const role = link.getAttribute('role');
    
    // Check if link has accessible name
    const hasAccessibleName = textContent || ariaLabel || ariaLabelledby;
    
    // Check if link has proper href (except for elements with role="link")
    const isFakeLink = !href || href === '#' || href === '';
    
    if (hasAccessibleName && (!isFakeLink || role === 'link')) {
      results.links.accessible++;
    } else {
      const issue = {
        element: link,
        index,
        message: ''
      };
      
      if (!hasAccessibleName) {
        issue.message = 'Link is missing accessible name (no text content, aria-label, or aria-labelledby)';
      } else if (isFakeLink && !role) {
        issue.message = 'Link is a fake link (missing or empty href attribute)';
      }
      
      results.links.issues.push(issue);
    }
  });

  // Check all buttons
  const buttons = document.querySelectorAll('button');
  results.buttons.total = buttons.length;

  buttons.forEach((button, index) => {
    const textContent = button.textContent.trim();
    const ariaLabel = button.getAttribute('aria-label');
    const ariaLabelledby = button.getAttribute('aria-labelledby');
    const ariaDescribedby = button.getAttribute('aria-describedby');
    const title = button.getAttribute('title');
    
    // Check if button has accessible name
    const hasAccessibleName = textContent || ariaLabel || ariaLabelledby || ariaDescribedby || title;
    
    if (hasAccessibleName) {
      results.buttons.accessible++;
    } else {
      results.buttons.issues.push({
        element: button,
        index,
        message: 'Button is missing accessible name (no text content, aria-label, aria-labelledby, aria-describedby, or title)'
      });
    }
  });

  // Check buttons with role="button"
  const buttonsWithRole = document.querySelectorAll('[role="button"]');
  buttonsWithRole.forEach((element, index) => {
    const tagName = element.tagName.toLowerCase();
    
    // Skip if it's already a <button> element
    if (tagName === 'button') return;
    
    const textContent = element.textContent.trim();
    const ariaLabel = element.getAttribute('aria-label');
    const ariaLabelledby = element.getAttribute('aria-labelledby');
    const ariaDescribedby = element.getAttribute('aria-describedby');
    const title = element.getAttribute('title');
    const tabIndex = element.getAttribute('tabindex');
    
    // Check if element has accessible name
    const hasAccessibleName = textContent || ariaLabel || ariaLabelledby || ariaDescribedby || title;
    
    // Check if element is keyboard accessible
    const isKeyboardAccessible = tabIndex !== null && tabIndex !== undefined;
    
    if (!hasAccessibleName) {
      results.buttons.issues.push({
        element,
        index,
        type: 'role-button',
        message: 'Element with role="button" is missing accessible name'
      });
    }
    
    if (!isKeyboardAccessible) {
      results.buttons.issues.push({
        element,
        index,
        type: 'role-button',
        message: 'Element with role="button" is not keyboard accessible (missing tabindex)'
      });
    }
  });

  return results;
};

// New function to validate the landmarks
const validateLandmark = () => {
  const landmarks = ['main', 'navigation', 'search', 'contentinfo', 'complementary', 'form', 'region'];

  const missingLandmarks = landmarks.filter(landmark => {
    const elements = document.querySelectorAll(`[role="${landmark}"], ${landmark}`);
    return elements.length === 0;
  });

  if (missingLandmarks.length > 0) {
    throw new Error(`Missing landmarks: ${missingLandmarks.join(', ')}`);
  }
};

// New function to add custom validation
const addCustomValidation = () => {
  // Validate that lang attribute is set
  const htmlElement = document.documentElement;
  if (!htmlElement.getAttribute('lang')) {
    console.warn('HTML element is missing lang attribute');
    return false;
  }

  // Validate that main landmark exists
  const mainElement = document.querySelector('main');
  if (!mainElement) {
    console.warn('Main landmark is missing');
    return false;
  }

  // Validate that tables have proper roles
  const tables = document.querySelectorAll('table');
  tables.forEach(table => {
    if (!table.getAttribute('role')) {
      console.warn('Table is missing role attribute');
    } else {
      // Table has role, continue with other checks
      // Additional table validation logic can be added here
    }
  });

  return true;
};

export function addSvgAccessibleName(svgElement, accessibleName) {
  if (!svgElement) return;

  // Add title element as first child
  const title = document.createElement('title');
  title.id = `svg-title-${Date.now()}`;
  title.textContent = accessibleName;

  // Insert title as first child
  svgElement.insertBefore(title, svgElement.firstChild);

  // Add aria-labelledby attribute
  svgElement.setAttribute('aria-labelledby', title.id);
}

export function isValidLink(element) {
  // ... existing code ...
}

export function addScopeToHeaders(tableElement) {
  // ... existing code ...
}

function addressAccessibilityIssues(insightReport) {
  insightReport.forEach(issue => {
    console.log(`Addressing issue: ${issue.issue}`);
    // TODO: Implement solution to the issue
    console.log(`Solution: ${issue.solution}`);
    // ... code to apply the solution ...
  });
}

export function myFunction() {
  // Your code for the new function goes here
}

function newFunction() {
  // implementation of new function
}

module.exports.newFunction = newFunction;

export {
  function3,
  App,
  getUniqueLandmarkName,
  validateUniqueLandmarks,
  addSvgAccessibleName,
  isValidLink,
  addScopeToHeaders,
  addressAccessibilityIssues,
  announceToScreenReader,
  trapFocus,
  manageFocusOnNavigation,
  prefersReducedMotion,
  setAriaExpanded,
  hasAccessibleName,
  myFunction,
  newFunction
};

// Export all functions
module.exports = {
  addLangAttribute,
  fixTableStructure,
  addMainLandmark,
  ensureUniqueLandmarks,
  addSvgAccessibleNames,
  fixFakeLinkIssue,
  checkLinksAndButtonsAccessibility,
  validateLandmark,
  addCustomValidation,
  wrapPrimaryContentInMain,
  getAccessibleName,
  setAccessibleName
};

// Create React root and render app
const root = createRoot(app);
root.render(<App />);