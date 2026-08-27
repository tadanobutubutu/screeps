// TODO: Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (DONE: addLangAttribute)
// - REACT_027: Fix 26 table structure issues (DONE: fixTableStructure)
// - REACT_017: Add/fix 2 landmark issues (DONE: addMainLandmark)
// - REACT_025: Ensure unique landmarks (DONE: ensureUniqueLandmarks)
// - REACT_041: Add accessible names to 2 SVGs (DONE: addSvgAccessibleNames)
// - REACT_036: Fix 1 fake link issue (DONE: fixFakeLinkIssue)

export const addLangAttribute = (htmlElement, lang = 'en') => {
  if (htmlElement && typeof htmlElement.setAttribute === 'function') {
    htmlElement.setAttribute('lang', lang);
  }
  return htmlElement;
};

export const fixTableStructure = (tableElement) => {
  if (!tableElement) return tableElement;
  
  // Ensure proper table structure
  const existingThead = tableElement.querySelector('thead');
  const existingTbody = tableElement.querySelector('tbody') || tableElement.tBodies[0];
  const thead = existingThead || document.createElement('thead');
  const tbody = existingTbody || document.createElement('tbody');
  
  if (!existingThead) {
    const firstRow = tableElement.rows[0];
    if (firstRow && firstRow.parentNode === tableElement) {
      tableElement.insertBefore(thead, firstRow);
    } else {
      tableElement.appendChild(thead);
    }
  }
  if (!existingTbody) {
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
  
  // Check if skip link already exists
  const existingSkipLink = containerElement.querySelector('.skip-link');
  if (existingSkipLink) return containerElement;
  
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
  if (!svgElements || svgElements.length === 0) {
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
    if (!svg.hasAttribute('role')) {
      svg.setAttribute('role', 'img');
    }
  });
  
  return svgElements;
};

export const fixFakeLinkIssue = (containerElement