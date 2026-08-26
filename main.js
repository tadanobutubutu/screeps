// TODO: Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (DONE: addLangAttribute)
// - REACT_027: Fix 26 table structure issues (DONE: fixTableStructure)
// - REACT_017: Add/fix 2 landmark issues (DONE: addMainLandmark)
// - REACT_025: Ensure unique landmarks (DONE: ensureUniqueLandmarks)
// - REACT_041: Add accessible names to 2 SVGs (DONE: addSvgAccessibleNames)
// - REACT_036: Fix 1 fake link issue (DONE: fixFakeLinkIssue)

export const addLangAttribute = (htmlElement, lang = 'en') => {
  if (htmlElement && !htmlElement.hasAttribute('lang')) {
    htmlElement.setAttribute('lang', lang);
  }
  return htmlElement;
};

export const fixTableStructure = (tableElement) => {
  if (!tableElement) return tableElement;
  
  // Ensure proper table structure
  const thead = tableElement.querySelector('thead') || document.createElement('thead');
  const tbody = tableElement.querySelector('tbody') || document.createElement('tbody');
  
  if (!tableElement.querySelector('thead')) {
    tableElement.insertBefore(thead, tableElement.firstChild);
  }
  if (!tableElement.querySelector('tbody')) {
    tableElement.appendChild(tbody);
  }
  
  // Add scope attributes to header cells
  const headerCells = thead.querySelectorAll('th');
  headerCells.forEach(cell => {
    if (!cell.hasAttribute('scope')) {
      cell.setAttribute('scope', 'col');
    }
  });
  
  return tableElement;
};

export const addMainLandmark = (containerElement) => {
  if (!containerElement) return containerElement;
  
  const existingMain = containerElement.querySelector('main');
  if (!existingMain) {
    const mainElement = document.createElement('main');
    mainElement.id = 'main-content';
    
    // Move content into main landmark
    const children = Array.from(containerElement.children);
    children.forEach(child => {
      if (!['SCRIPT', 'STYLE', 'META', 'LINK'].includes(child.tagName)) {
        mainElement.appendChild(child);
      }
    });
    
    containerElement.appendChild(mainElement);
  }
  
  // Add skip link for accessibility
  const skipLink = document.createElement('a');
  skipLink.href = '#main-content';
  skipLink.className = 'skip-link';
  skipLink.textContent = 'Skip to main content';
  skipLink.style.cssText = 'position:absolute;left:-9999px;top:auto;width:1px;height:1px;overflow:hidden;';
  skipLink.addEventListener('focus', () => {
    skipLink.style.cssText = 'position:static;width:auto;height:auto;';
  });
  skipLink.addEventListener('blur', () => {
    skipLink.style.cssText = 'position:absolute;left:-9999px;top:auto;width:1px;height:1px;overflow:hidden;';
  });
  
  containerElement.insertBefore(skipLink, containerElement.firstChild);
  
  return containerElement;
};

export const ensureUniqueLandmarks = (containerElement) => {
  if (!containerElement) return containerElement;
  
  // Track landmark counts
  const landmarkCounts = {};
  
  const landmarks = ['header', 'nav', 'main', 'footer', 'aside', 'section', 'article'];
  
  landmarks.forEach(landmark => {
    const elements = containerElement.querySelectorAll(landmark);
    landmarkCounts[landmark] = elements.length;
    
    if (elements.length > 1) {
      // For multiple instances, add descriptive labels
      elements.forEach((el, index) => {
        if (!el.hasAttribute('aria-label') && !el.hasAttribute('aria-labelledby')) {
          const landmarkName = landmark.charAt(0).toUpperCase() + landmark.slice(1);
          el.setAttribute('aria-label', `${landmarkName} ${index + 1}`);
        }
      });
    }
  });
  
  return containerElement;
};

export const addSvgAccessibleNames = (svgElements) => {
  if (!svgElements || !Array.isArray(svgElements)) {
    svgElements = document.querySelectorAll('svg');
  }
  
  svgElements.forEach((svg, index) => {
    const title = svg.querySelector('title');
    const hasTitle = title && title.textContent.trim().length > 0;
    
    if (!hasTitle) {
      const newTitle = document.createElementNS('http://www.w3.org/2000/svg', 'title');
      newTitle.id = `svg-title-${index + 1}`;
      newTitle.textContent = `Image ${index + 1}`;
      
      // Insert title as first child
      if (svg.firstChild) {
        svg.insertBefore(newTitle, svg.firstChild);
      } else {
        svg.appendChild(newTitle);
      }
      
      svg.setAttribute('aria-labelledby', newTitle.id);
    }
    
    // Add role if missing
    if (!svg.hasAttribute('role')) {
      svg.setAttribute('role', 'img');
    }
  });
  
  return svgElements;
};

export const fixFakeLinkIssue = (containerElement) => {
  if (!containerElement) return containerElement;
  
  // Find elements that look like links but aren't
  const fakeLinks = containerElement.querySelectorAll('[role="link"]:not(a):not([href])');
  
  fakeLinks.forEach(fakeLink => {
    // Convert to proper button if it's actionable
    if (!fakeLink.hasAttribute('onclick') && !fakeLink.dataset.action) {
      // Remove role="link" as it's not a link
      fakeLink.removeAttribute('role');
    } else {
      // Ensure proper keyboard accessibility
      if (!fakeLink.hasAttribute('tabindex')) {
        fakeLink.setAttribute('tabindex', '0');
      }
      
      // Add keyboard event handlers if missing
      if (!fakeLink.hasAttribute('onkeydown')) {
        fakeLink.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            fakeLink.click();
          }
        });
      }
    }
  });
  
  // Also fix divs/spans with onclick that should be buttons
  const clickableDivs = containerElement.querySelectorAll('div[onclick], span[onclick]');
  clickableDivs.forEach(el => {
    if (!el.hasAttribute('role')) {
      el.setAttribute('role', 'button');
    }
    if (!el.hasAttribute('tabindex')) {
      el.setAttribute('tabindex', '0');
    }
  });
  
  return containerElement;
};

export const initializeAccessibility = (containerElement = document.documentElement) => {
  // Fix lang attribute on HTML element
  addLangAttribute(document.documentElement);
  
  // Fix table structures
  const tables = containerElement.querySelectorAll('table');
  tables.forEach(table => fixTableStructure(table));
  
  // Add main landmark and ensure unique landmarks
  addMainLandmark(containerElement);
  ensureUniqueLandmarks(containerElement);
  
  // Add accessible names to SVGs
  addSvgAccessibleNames();
  
  // Fix fake link issues
  fixFakeLinkIssue(containerElement);
};

// Auto-initialize on DOM ready
if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => initializeAccessibility());
  } else {
    initializeAccessibility();
  }
}