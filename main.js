const dependencyGraphModule = require('./dependencyGraph');
const indexModule = require('./index');

// Accessibility: Updated dependencyGraphFunction to use dependencyGraphContent directly
// with proper accessibility attributes and semantic HTML
function dependencyGraphFunction() {
  const { dependencyGraphContent } = dependencyGraphModule;
  
  // Ensure the returned content has proper accessibility attributes
  if (dependencyGraphContent && dependencyGraphContent.element) {
    // Add role and aria-label if not present for screen reader support (REACT_041)
    if (!dependencyGraphContent.element.getAttribute('role')) {
      dependencyGraphContent.element.setAttribute('role', 'img');
    }
    if (!dependencyGraphContent.element.getAttribute('aria-label')) {
      dependencyGraphContent.element.setAttribute('aria-label', 'Dependency graph visualization');
    }
    if (!dependencyGraphContent.element.getAttribute('aria-hidden')) {
      dependencyGraphContent.element.setAttribute('aria-hidden', 'false');
    }
    
    // Add accessible names to SVGs (REACT_041)
    const svgs = dependencyGraphContent.element.querySelectorAll('svg');
    svgs.forEach((svg, index) => {
      if (!svg.getAttribute('aria-label') && !svg.getAttribute('aria-labelledby')) {
        const accessibleName = svg.id ? `SVG graphic: ${svg.id}` : `Dependency graph SVG ${index + 1}`;
        svg.setAttribute('aria-label', accessibleName);
      }
    });
    
    // Fix table structure issues (REACT_027)
    const tables = dependencyGraphContent.element.querySelectorAll('table');
    tables.forEach((table) => {
      // Ensure tables have proper headers
      const headers = table.querySelectorAll('th');
      headers.forEach((th) => {
        if (!th.getAttribute('scope')) {
          th.setAttribute('scope', 'col');
        }
      });
      
      // Add caption if table doesn't have one and has headers
      if (!table.querySelector('caption') && headers.length > 0) {
        const caption = document.createElement('caption');
        caption.textContent = 'Dependency information';
        caption.style.clip = 'rect(0 0 0 0)';
        caption.style.clipPath = 'inset(50%)';
        caption.style.height = '1px';
        caption.style.overflow = 'hidden';
        caption.style.whiteSpace = 'nowrap';
        caption.style.width = '1px';
        table.insertBefore(caption, table.firstChild);
      }
    });
  }
  
  // Ensure lang attribute exists on HTML element (REACT_015)
  if (typeof document !== 'undefined') {
    ensureLangAttribute(document);
  }
  
  // ... existing code for rendering the dependency graph
  return dependencyGraphContent;
}

// Accessibility: Updated indexFunction to use indexContent directly
// with proper accessibility attributes and semantic HTML
function indexFunction() {
  const { indexContent } = indexModule;
  
  // Ensure the returned content has proper accessibility attributes
  if (indexContent && indexContent.element) {
    // Add semantic structure for screen reader support (REACT_017)
    if (!indexContent.element.getAttribute('role')) {
      indexContent.element.setAttribute('role', 'region');
    }
    if (!indexContent.element.getAttribute('aria-label')) {
      indexContent.element.setAttribute('aria-label', 'Index view');
    }
    if (!indexContent.element.getAttribute('tabindex')) {
      indexContent.element.setAttribute('tabindex', '-1');
    }
    
    // Ensure unique landmarks (REACT_025)
    const existingLabel = indexContent.element.getAttribute('aria-label');
    const existingId = indexContent.element.id;
    if (existingId) {
      indexContent.element.setAttribute('aria-label', `${existingLabel || 'Index view'} - ${existingId}`);
    }
    
    // Fix landmark issues - add main landmark if appropriate (REACT_017)
    const mainElement = indexContent.element.querySelector('main');
    if (mainElement && !mainElement.getAttribute('aria-label')) {
      mainElement.setAttribute('aria-label', 'Main content');
    }
    
    // Fix fake link issues (REACT_036)
    const links = indexContent.element.querySelectorAll('a');
    links.forEach((link) => {
      const href = link.getAttribute('href');
      // If link doesn't have valid href, either fix it or convert to button
      if (!href || href === '#' || href === '') {
        // Check if it's meant to be a link or a button
        const onclickAttr = link.getAttribute('onclick');
        const role = link.getAttribute('role');
        if (!role && onclickAttr) {
          link.setAttribute('role', 'button');
          link.setAttribute('tabindex', '0');
          // Ensure keyboard operability
          if (!link.getAttribute('onkeydown')) {
            link.setAttribute('onkeydown', `if(event.key==='Enter'||event.key===' '){${onclickAttr}}`);
          }
        }
      }
    });
    
    // Fix table structure issues in index view (REACT_027)
    const tables = indexContent.element.querySelectorAll('table');
    tables.forEach((table) => {
      const headers = table.querySelectorAll('th');
      headers.forEach((th) => {
        if (!th.getAttribute('scope')) {
          th.setAttribute('scope', 'col');
        }
      });
    });
  }
  
  // Ensure lang attribute exists on HTML element (REACT_015)
  if (typeof document !== 'undefined') {
    ensureLangAttribute(document);
  }
  
  // ... existing code for rendering the index view
  return indexContent;
}

// Function to add lang attribute to HTML element (REACT_015)
function ensureLangAttribute(doc) {
  const htmlElement = doc.documentElement || doc.querySelector('html');
  if (htmlElement && !htmlElement.hasAttribute('lang')) {
    htmlElement.setAttribute('lang', 'en');
  }
  return doc;
}

// Function to ensure unique landmark labels (REACT_025)
function ensureUniqueLandmarks(container) {
  const landmarks = container.querySelectorAll('[role="region"], [role="main"], [role="navigation"], [role="banner"], [role="contentinfo"]');
  const seenLabels = new Set();
  
  landmarks.forEach((landmark) => {
    let label = landmark.getAttribute('aria-label') || landmark.getAttribute('aria-labelledby');
    
    if (label && seenLabels.has(label)) {
      // Make label unique by appending count
      let count = 2;
      let newLabel = `${label} ${count}`;
      while (seenLabels.has(newLabel)) {
        count++;
        newLabel = `${label} ${count}`;
      }
      landmark.setAttribute('aria-label', newLabel);
      seenLabels.add(newLabel);
    } else if (label) {
      seenLabels.add(label);
    }
  });
  
  return container;
}

// ... other functions and exports

// Added the required exports
module.exports = {
  dependencyGraphFunction,
  indexFunction,
  ensureLangAttribute,
  ensureUniqueLandmarks,
};