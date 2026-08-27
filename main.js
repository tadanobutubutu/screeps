// Existing code, imports, and exports

export const addLangAttribute = (htmlElement, lang = 'en') => {
  if (htmlElement && typeof htmlElement.setAttribute === 'function') {
    htmlElement.setAttribute('lang', lang);
  }
  return htmlElement;
};

export const fixTableStructure = (tableElement) => {
  if (!tableElement) return tableElement;
  
  // Ensure proper table structure
  const thead = tableElement.querySelector('thead') || document.createElement('thead');
  const tbody = tableElement.querySelector('tbody') || document.createElement('tbody');
  
  if (!tableElement.querySelector('thead') && tableElement.rows && tableElement.rows.length > 0) {
    tableElement.insertBefore(thead, tableElement.firstChild);
  }
  if (!tableElement.querySelector('tbody') && tableElement.rows && tableElement.rows.length > 0) {
    tableElement.appendChild(tbody);
  }
  
  // Add scope attributes to header cells
  const headerCells = tableElement.querySelectorAll('th');
  headerCells.forEach(cell => {
    if (!cell.getAttribute('scope')) {
      cell.setAttribute('scope', 'col');
    }
  });
  
  return tableElement;
};

export const addMainLandmark = (containerElement) => {
  if (!containerElement) return containerElement;
  
  const existingMain = containerElement.querySelector('main, [role="main"]');
  if (!existingMain) {
    const mainElement = document.createElement('main');
    mainElement.id = 'main-content';
    
    // Move content into main landmark
    const children = Array.from(containerElement.childNodes);
    children.forEach(child => {
      if (!['SCRIPT', 'STYLE', 'META', 'LINK', 'NOSCRIPT'].includes(child.nodeName)) {
        mainElement.appendChild(child);
      }
    });
    
    containerElement.insertBefore(mainElement, containerElement.firstChild);
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
        if (!el.getAttribute('aria-label') && !el.getAttribute('aria-labelledby')) {
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
      const newTitle = document.createElement('title');
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
    if (!svg.getAttribute('role')) {
      svg.setAttribute('role', 'img');
    }
  });
  
  return svgElements;
};

export const fixFakeLinkIssue = (containerElement) => {
  if (!containerElement) return containerElement;
  
  // Find elements that look like links but aren't
  const fakeLinks = containerElement.querySelectorAll('[role="link"]');
  
  fakeLinks.forEach(fakeLink => {
    // Convert to proper button if it's actionable
    if (fakeLink.onclick && !fakeLink.dataset.action) {
      // Remove role="link" as it's not a link
      fakeLink.removeAttribute('role');
    } else {
      // Ensure proper keyboard accessibility
      if (!fakeLink.getAttribute('tabindex')) {
        fakeLink.setAttribute('tabindex', '0');
      }
      
      // Add keyboard event handlers if missing
      if (!fakeLink.onclick) {
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
    if (!el.getAttribute('role')) {
      el.setAttribute('role', 'button');
    }
    if (!el.getAttribute('tabindex')) {
      el.setAttribute('tabindex', '0');
    }
  });
  
  return containerElement;
};

export const initializeAccessibility = (containerElement = document.documentElement) => {
  // Fix lang attribute on HTML element
  addLangAttribute(containerElement.tagName === 'HTML' ? containerElement : document.documentElement);
  
  // Fix table structures
  const tables = containerElement.querySelectorAll('table');
  tables.forEach(table => fixTableStructure(table));
  
  // Add main landmark and ensure unique landmarks
  addMainLandmark(containerElement);
  ensureUniqueLandmarks(containerElement);
  
  // Add accessible names to SVGs
  addSvgAccessibleNames(containerElement.querySelectorAll('svg'));
  
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