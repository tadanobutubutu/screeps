// TODO: Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (DONE: addLangAttribute)
// - REACT_027: Fix 26 table structure issues (DONE: validateTableStructure, fixTableStructure)
// - REACT_017: Add/fix 2 landmark issues (DONE: addMainLandmark)
// - REACT_025: Ensure unique landmarks (DONE: ensureUniqueLandmarks)
// - REACT_041: Add accessible names to 2 SVGs (DONE: getSvgAccessibleName)
// - REACT_036: Fix 1 fake link issue (DONE: personName)

export function addLangAttribute(htmlElement, lang = 'en') {
  if (htmlElement && !htmlElement.hasAttribute('lang')) {
    htmlElement.setAttribute('lang', lang);
  }
  return htmlElement;
}

export function validateTableStructure(table) {
  if (!table) return false;
  
  const hasThead = table.querySelector('thead') !== null;
  const hasTbody = table.querySelector('tbody') !== null;
  const rows = table.querySelectorAll('tr');
  
  if (!hasThead && rows.length === 0) return false;
  
  let validStructure = true;
  
  if (hasThead) {
    const theadRows = table.querySelectorAll('thead tr');
    theadRows.forEach(row => {
      const cells = row.querySelectorAll('th, td');
      if (cells.length === 0) validStructure = false;
    });
  }
  
  return validStructure;
}

export function fixTableStructure(table) {
  if (!table) return table;
  
  if (!table.querySelector('tbody')) {
    const allRows = table.querySelectorAll('tr');
    if (allRows.length > 0) {
      const tbody = document.createElement('tbody');
      allRows.forEach(row => {
        if (!row.closest('thead')) {
          tbody.appendChild(row);
        }
      });
      table.appendChild(tbody);
    }
  }
  
  if (!table.querySelector('thead')) {
    const firstTbody = table.querySelector('tbody');
    if (firstTbody) {
      const firstRow = firstTbody.querySelector('tr');
      if (firstRow) {
        const thead = document.createElement('thead');
        const headerRow = document.createElement('tr');
        
        const cells = firstRow.querySelectorAll('td');
        cells.forEach(cell => {
          const th = document.createElement('th');
          th.textContent = cell.textContent;
          headerRow.appendChild(th);
        });
        
        thead.appendChild(headerRow);
        table.insertBefore(thead, table.firstChild);
      }
    }
  }
  
  return table;
}

export function addMainLandmark(container) {
  if (!container) return null;
  
  let mainElement = container.querySelector('main');
  
  if (!mainElement) {
    mainElement = document.createElement('main');
    mainElement.setAttribute('id', 'main-content');
    
    const existingContent = Array.from(container.children);
    existingContent.forEach(child => {
      if (!child.tagName || 
          !['HEADER', 'NAV', 'FOOTER', 'ASIDE'].includes(child.tagName)) {
        mainElement.appendChild(child);
      }
    });
    
    container.appendChild(mainElement);
  }
  
  return mainElement;
}

export function ensureUniqueLandmarks(container) {
  if (!container) return;
  
  const landmarks = container.querySelectorAll('header, nav, main, footer, aside');
  const seen = new Map();
  
  landmarks.forEach(landmark => {
    const tagName = landmark.tagName.toLowerCase();
    
    if (!seen.has(tagName)) {
      seen.set(tagName, []);
    }
    seen.get(tagName).push(landmark);
  });
  
  seen.forEach((elements, tagName) => {
    if (elements.length > 1) {
      elements.forEach((el, index) => {
        if (!el.hasAttribute('aria-label') && !el.hasAttribute('aria-labelledby')) {
          el.setAttribute('aria-label', `${tagName}-${index + 1}`);
        }
      });
    }
  });
  
  return container;
}

export function getSvgAccessibleName(svgElement, name) {
  if (!svgElement) return null;
  
  let title = svgElement.querySelector('title');
  
  if (!title) {
    title = document.createElement('title');
    title.textContent = name;
    svgElement.insertBefore(title, svgElement.firstChild);
  } else {
    title.textContent = name;
  }
  
  svgElement.setAttribute('role', 'img');
  svgElement.setAttribute('aria-labelledby', title.id || 'svg-title');
  
  if (!title.id) {
    title.id = 'svg-title';
    svgElement.setAttribute('aria-labelledby', 'svg-title');
  }
  
  return svgElement;
}

export function personName(element) {
  if (!element) return null;
  
  if (element.tagName === 'A' || element.tagName === 'BUTTON') {
    return element;
  }
  
  if (element.tagName === 'SPAN' || element.tagName === 'DIV') {
    if (element.onclick || element.getAttribute('role') === 'button') {
      element.setAttribute('role', 'button');
      element.tabIndex = 0;
      
      if (!element.hasAttribute('aria-label')) {
        element.setAttribute('aria-label', element.textContent.trim());
      }
    }
  }
  
  return element;
}