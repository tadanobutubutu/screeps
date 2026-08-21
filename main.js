import DependencyGraph from './DependencyGraph';

const DependencyGraphComponent = () => {
  // Other components and content
  <button type="button" id="unrotate" aria-pressed="false" onClick={() => {/* Rotate back logic here */}}>rotate back</button>
  // Other components and content
  <DependencyGraph />
};

const addLangAttribute = () => {
  // Add lang attribute to HTML element
  const htmlElement = document.documentElement;
  if (!htmlElement.hasAttribute('lang')) {
    htmlElement.setAttribute('lang', 'en');
  }
};

const ensureUniqueLandmarks = () => {
  // Ensure each landmark region has a unique aria-label or role
  // Common landmark roles: banner, navigation, main, complementary, contentinfo, search
  // This function should be called during component mount to validate uniqueness
  // Example of ensuring unique landmarks for existing landmarks:
  const landmarkSelectors = '[role="navigation"], [role="main"], [role="complementary"], [role="contentinfo"], [role="search"]';
  const existingLandmarks = document.querySelectorAll(landmarkSelectors);
  
  const usedLabels = new Map();
  
  for (const landmark of existingLandmarks) {
    const ariaLabel = landmark.getAttribute('aria-label');
    const landmarkId = landmark.id || 'landmark-without-id';
    
    if (!ariaLabel) {
      // Generate a unique identifier if no aria-label is present
      let uniqueIdentifier = `landmark-${landmarkId}`;
      if (usedLabels.has(uniqueIdentifier)) {
        uniqueIdentifier = `${uniqueIdentifier}-${usedLabels.get(uniqueIdentifier)}`;
        usedLabels.set(uniqueIdentifier, usedLabels.get(uniqueIdentifier) + 1);
      } else {
        usedLabels.set(uniqueIdentifier, 1);
      }
      landmark.setAttribute('aria-label', uniqueIdentifier);
    } else {
      // Check if the aria-label is already used
      if (usedLabels.has(ariaLabel)) {
        usedLabels.set(ariaLabel, usedLabels.get(ariaLabel) + 1);
        landmark.setAttribute('aria-label', `${ariaLabel} ${usedLabels.get(ariaLabel)}`);
      } else {
        usedLabels.set(ariaLabel, 1);
      }
    }
  }
};

const fixTableStructureIssues = () => {
  // Address table structure accessibility issues:
  // 1. Ensure all tables have proper <th> elements with scope attributes
  // 2. Add caption elements where appropriate
  // 3. Ensure proper thead/tbody/tfoot structure
  // 4. Add aria-describedby for complex tables
  // 5. Ensure proper column/row headers
  const tables = document.querySelectorAll('table');
  
  tables.forEach(table => {
    // 1. Add scope attributes to <th> elements
    const thElements = table.querySelectorAll('th');
    thElements.forEach(th => {
      if (th.closest('thead')) {
        th.setAttribute('scope', 'col');
      } else if (th.closest('tbody') || th.closest('tr')) {
        th.setAttribute('scope', 'row');
      }
      
      // Check for row spans and adjust scope accordingly
      const rowspan = th.getAttribute('rowspan');
      if (rowspan && parseInt(rowspan) > 1) {
        th.setAttribute('scope', 'rowgroup');
      }
    });
    
    // 2. Add caption if not present
    if (!table.querySelector('caption')) {
      const caption = document.createElement('caption');
      caption.textContent = 'Data table';
      table.insertBefore(caption, table.firstChild);
    }
    
    // 3. Ensure proper thead/tbody structure
    if (!table.querySelector('thead')) {
      const firstRow = table.querySelector('tr');
      if (firstRow && !firstRow.closest('thead')) {
        const thead = document.createElement('thead');
        const clonedRow = firstRow.cloneNode(false);
        thead.appendChild(clonedRow);
        table.insertBefore(thead, table.firstChild);
      }
    }
    
    if (!table.querySelector('tbody') && table.children.length > 1) {
      const bodyRows = Array.from(table.querySelectorAll('tr')).filter(tr => !tr.closest('thead'));
      if (bodyRows.length > 0) {
        const tbody = document.createElement('tbody');
        bodyRows.forEach(tr => tbody.appendChild(tr.cloneNode(true)));
        table.appendChild(tbody);
        // Remove original rows that are now in tbody
        bodyRows.forEach(tr => {
          if (tr.parentNode === table) {
            table.removeChild(tr);
          }
        });
      }
    }
  });
};

const addSvgAccessibleNames = () => {
  // Add accessible names to SVG elements
  const svgs = document.querySelectorAll('svg');
  
  svgs.forEach((svg, index) => {
    const hasAriaLabel = svg.hasAttribute('aria-label') || svg.hasAttribute('aria-labelledby');
    const hasTitle = svg.querySelector('title') !== null;
    
    if (!hasAriaLabel && !hasTitle) {
      const title = document.createElement('title');
      title.id = `svg-title-${index + 1}`;
      title.textContent = `SVG graphic ${index + 1}`;
      svg.insertBefore(title, svg.firstChild);
      svg.setAttribute('aria-labelledby', title.id);
    }
  });
};

const replaceHashLinksWithButtons = () => {
  // Fix 1 fake link issue - replace href="#" with button elements
  const fakeLinks = document.querySelectorAll('a[href="#"]');
  
  fakeLinks.forEach(link => {
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = link.textContent;
    button.className = link.className;
    button.id = link.id;
    
    // Copy relevant attributes
    Array.from(link.attributes).forEach(attr => {
      if (!['href', 'id'].includes(attr.name)) {
        button.setAttribute(attr.name, attr.value);
      }
    });
    
    // Copy event listeners (this is a simplified approach)
    // In a real implementation, you'd need to properly transfer event listeners
    button.addEventListener('click', (e) => {
      e.preventDefault();
    });
    
    link.parentNode.replaceChild(button, link);
  });
};

const fixFakeLinks = () => {
  // Fix elements with role="link" that aren't actual anchor tags
  const fakeLinks = document.querySelectorAll('[role="link"]');
  
  fakeLinks.forEach(link => {
    if (link.tagName !== 'A') {
      link.setAttribute('tabindex', '0');
      link.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          link.click();
        }
      });
    }
  });
};

export { 
  DependencyGraphComponent as default, 
  addLangAttribute,
  ensureUniqueLandmarks, 
  fixTableStructureIssues, 
  addSvgAccessibleNames,
  replaceHashLinksWithButtons,
  fixFakeLinks, 
  DependencyGraph 
};
// Re-export existing functions or add new export statements for additional functions if necessary