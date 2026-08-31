/**
 * Main entry point for the application
 */

// Function to create in-page buttons
function createInPageButton(buttonText, onClickHandler) {
  const button = document.createElement('button');
  button.textContent = buttonText;
  button.onclick = onClickHandler;
  return button;
}

// TODO: Implement this function for creating in-page buttons
// (Now implemented)

// Example usage (if needed):
// const btn = createInPageButton('Click Me', () => console.log('Clicked'));
// ...

export { createInPageButton };

// REACT_015: Add lang attribute to HTML element
function addLangAttribute(htmlElement, langCode) {
  if (htmlElement && langCode && typeof langCode === 'string') {
    htmlElement.setAttribute('lang', langCode);
    return true;
  }
  return false;
}

// REACT_017: Add landmark roles and fix landmark issues
function addLandmarkRoles() {
  const issues = [];
  
  // Ensure main element has appropriate role
  const mainElements = document.querySelectorAll('main');
  mainElements.forEach(main => {
    if (!main.id && !main.getAttribute('role')) {
      main.setAttribute('role', 'main');
    }
  });
  
  // Ensure header elements have appropriate landmarks
  const headers = document.querySelectorAll('header');
  headers.forEach(header => {
    if (!header.id && !header.getAttribute('role')) {
      // Check if it's a banner landmark
      const parent = header.parentElement;
      if (parent && parent.tagName !== 'SECTION' && parent.tagName !== 'ARTICLE') {
        header.setAttribute('role', 'banner');
      }
    }
  });
  
  // Ensure nav elements have appropriate roles
  const navElements = document.querySelectorAll('nav');
  navElements.forEach((nav, index) => {
    if (!nav.id && !nav.getAttribute('role')) {
      nav.setAttribute('role', 'navigation');
    }
    if (!nav.getAttribute('aria-label') && !nav.getAttribute('aria-labelledby')) {
      const labels = ['Primary', 'Secondary', 'Footer', 'Breadcrumb'];
      const label = labels[index] || `Navigation ${index + 1}`;
      nav.setAttribute('aria-label', label);
    }
  });
  
  // Ensure footer elements have appropriate roles
  const footers = document.querySelectorAll('footer');
  footers.forEach(footer => {
    if (!footer.id && !footer.getAttribute('role')) {
      const parent = footer.parentElement;
      if (parent && parent.tagName !== 'SECTION' && parent.tagName !== 'ARTICLE') {
        footer.setAttribute('role', 'contentinfo');
      }
    }
  });
  
  return issues;
}

// REACT_025: Ensure unique landmarks
function ensureUniqueLandmarks() {
  const issues = [];
  const landmarkSelectors = ['[role="banner"]', '[role="navigation"]', '[role="main"]', '[role="contentinfo"]', '[role="search"]'];
  
  landmarkSelectors.forEach(selector => {
    const elements = document.querySelectorAll(selector);
    if (elements.length > 1) {
      elements.forEach((el, index) => {
        if (index > 0) {
          const parent = el.parentElement;
          if (parent && !parent.id) {
            parent.id = `${selector.replace(/[^a-z]/g, '')}_landmark_${index}`;
            el.setAttribute('aria-labelledby', parent.id);
          }
        }
      });
      issues.push({
        type: 'REACT_025',
        message: `Multiple ${selector} landmarks found. Added IDs to distinguish them.`,
        count: elements.length
      });
    }
  });
  
  return issues;
}

// REACT_036: Fix fake link issues
function fixFakeLinks() {
  const issues = [];
  const fakeLinks = document.querySelectorAll('a[href="#"], a[href=""], a:not([href])');
  
  fakeLinks.forEach(link => {
    // Check if the link behaves like a button (onclick handler present)
    const hasButtonBehavior = link.getAttribute('onclick') || 
                               link.getAttribute('role') === 'button' ||
                               link.classList.contains('btn') ||
                               link.classList.contains('button');
    
    if (hasButtonBehavior) {
      // Option 1: Change to button element
      const newButton = document.createElement('button');
      newButton.textContent = link.textContent;
      
      // Copy attributes
      Array.from(link.attributes).forEach(attr => {
        if (attr.name !== 'href' && attr.name !== 'onclick') {
          newButton.setAttribute(attr.name, attr.value);
        }
      });
      
      // Copy onclick handler
      const onclick = link.getAttribute('onclick');
      if (onclick) {
        newButton.setAttribute('onclick', onclick);
      }
      
      // Replace the link
      link.parentNode.replaceChild(newButton, link);
      
      issues.push({
        type: 'REACT_036',
        message: 'Converted fake link to proper button element',
        element: 'a[href="#"]'
      });
    } else if (!link.getAttribute('href')) {
      // Add warning for links without href
      issues.push({
        type: 'REACT_036',
        message: 'Found link without href attribute',
        element: 'a:not([href])'
      });
    }
  });
  
  return issues;
}

// REACT_027: Add scope="col" or scope="row" to <th> elements (already implemented)
function addTableScopes() {
  const tables = document.querySelectorAll('table');
  const results = [];
  
  tables.forEach(table => {
    const headers = table.querySelectorAll('th');
    headers.forEach(th => {
      if (!th.hasAttribute('scope')) {
        const row = th.parentElement;
        const cells = Array.from(row.cells);
        const cellIndex = cells.indexOf(th);
        
        // Check if it's a column header or row header
        const firstCell = cells[0];
        const isRowHeader = firstCell && firstCell === th;
        
        if (isRowHeader || (th.textContent && th.textContent.trim() !== '')) {
          th.setAttribute('scope', cellIndex === 0 ? 'row' : 'col');
        }
      }
    });
  });
  
  return results;
}

function analyzeAccessibility(issuesData) {
  const issues = [];
  
  // Run all accessibility fixes and collect issues
  const landmarkIssues = addLandmarkRoles();
  issues.push(...landmarkIssues);
  
  const uniqueLandmarkIssues = ensureUniqueLandmarks();
  issues.push(...uniqueLandmarkIssues);
  
  const fakeLinkIssues = fixFakeLinks();
  issues.push(...fakeLinkIssues);
  
  // REACT_015: Check for lang attribute
  const htmlElement = document.querySelector('html');
  if (!htmlElement || !htmlElement.getAttribute('lang')) {
    issues.push({
      type: 'REACT_015',
      message: 'HTML element missing lang attribute'
    });
  }
  
  return {
    originalData: issuesData,
    issues: issues,
    summary: {
      totalIssues: issues.length,
      byType: issues.reduce((acc, issue) => {
        acc[issue.type] = (acc[issue.type] || 0) + 1;
        return acc;
      }, {})
    }
  };
}

function generateAccessibilityReport(issuesData) {
  const analyzedIssues = analyzeAccessibility(issuesData);

  // Define the structure of the report here
  const report = {
    introduction: 'Accessibility report for the application',
    data: {
      issues: analyzedIssues.issues,
      summary: analyzedIssues.summary
    },
    conclusions: `Found ${analyzedIssues.summary.totalIssues} accessibility issues. ` +
                 `REACT_015: ${analyzedIssues.summary.byType['REACT_015'] || 0}, ` +
                 `REACT_017: ${analyzedIssues.summary.byType['REACT_017'] || 0}, ` +
                 `REACT_025: ${analyzedIssues.summary.byType['REACT_025'] || 0}, ` +
                 `REACT_036: ${analyzedIssues.summary.byType['REACT_036'] || 0}`
  };

  // Fill the report's data and conclusions
  // ...

  // Return the final report
  return report;
}

// Export the report function as well
export { generateAccessibilityReport };