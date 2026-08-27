// TODO: Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (DONE: addLangAttribute)
// - REACT_027: Fix 26 table structure issues (DONE: fixTableStructure)
// - REACT_017: Add/fix 4 landmark issues (DONE: addMainLandmark)
// - REACT_025: Ensure unique landmarks (DONE: ensureUniqueLandmarks)
// - REACT_041: Add accessible names to 2 SVGs (DONE: addSvgAccessibleNames)
// - REACT_036: Fix 1 fake link issue (DONE: fixFakeLinkIssue)

function addLangAttribute(document, lang = 'en') {
  let htmlElement = document.querySelector('html');
  if (!htmlElement) {
    htmlElement = document.createElement('html');
    if (document.firstChild) {
      document.insertBefore(htmlElement, document.firstChild);
    } else {
      document.appendChild(htmlElement);
    }
  }
  htmlElement.setAttribute('lang', lang);
  return htmlElement;
}

function fixTableStructure(document) {
  const tables = document.querySelectorAll('table');
  tables.forEach(table => {
    const hasThead = table.querySelector('thead');
    const hasTbody = table.querySelector('tbody');
    const rows = table.querySelectorAll('tr');
    
    if (rows.length > 0 && !hasThead) {
      const firstRow = rows[0];
      const thead = document.createElement('thead');
      const tbody = document.createElement('tbody');
      
      thead.appendChild(firstRow);
      
      for (let i = 1; i < rows.length; i++) {
        tbody.appendChild(rows[i]);
      }
      
      table.insertBefore(thead, table.firstChild);
      if (!hasTbody) {
        table.appendChild(tbody);
      }
    }
    
    const cells = table.querySelectorAll('td');
    cells.forEach(cell => {
      if (!cell.hasAttribute('scope')) {
        const row = cell.parentElement;
        const cellIndex = Array.from(row.children).indexOf(cell);
        if (row.previousElementSibling && row.previousElementSibling.tagName === 'THEAD') {
          cell.setAttribute('scope', 'col');
        } else {
          cell.setAttribute('scope', 'row');
        }
      }
    });
  });
  return tables.length;
}

function addMainLandmark(document) {
  let mainElements = document.querySelectorAll('main');
  
  if (mainElements.length === 0) {
    const main = document.createElement('main');
    main.setAttribute('role', 'main');
    
    const body = document.querySelector('body');
    if (body) {
      const existingContent = Array.from(body.children);
      existingContent.forEach(child => {
        if (!['SCRIPT', 'STYLE', 'LINK', 'META'].includes(child.tagName)) {
          main.appendChild(child);
        }
      });
      body.insertBefore(main, body.firstChild);
    }
    mainElements = [main];
  } else {
    mainElements.forEach(main => {
      if (!main.id) {
        main.setAttribute('role', 'main');
      }
    });
  }
  
  return mainElements.length;
}

function ensureUniqueLandmarks(document) {
  const landmarks = ['header', 'nav', 'main', 'footer', 'aside', 'section', 'article'];
  const landmarkCounts = {};
  
  landmarks.forEach(landmark => {
    const elements = document.querySelectorAll(landmark);
    landmarkCounts[landmark] = elements.length;
  });
  
  const duplicates = [];
  landmarks.forEach(landmark => {
    const elements = document.querySelectorAll(`${landmark}:not([id])`);
    if (elements.length > 1) {
      elements.forEach((el, index) => {
        if (index > 0) {
          const id = `${landmark}-${index + 1}`;
          el.setAttribute('id', id);
          duplicates.push({ element: landmark, id });
        }
      });
    }
  });
  
  return duplicates;
}

function addSvgAccessibleNames(document) {
  const svgs = document.querySelectorAll('svg:not([aria-label]):not([aria-labelledby])');
  let count = 0;
  
  svgs.forEach((svg, index) => {
    const title = svg.querySelector('title');
    if (title) {
      const titleId = `svg-title-${index + 1}`;
      title.setAttribute('id', titleId);
      svg.setAttribute('aria-labelledby', titleId);
      count++;
    } else {
      const altText = svg.getAttribute('alt') || svg.dataset.label || `SVG element ${index + 1}`;
      svg.setAttribute('aria-label', altText);
      count++;
    }
  });
  
  return count;
}

function fixFakeLinkIssue(document) {
  const fakeLinks = document.querySelectorAll('a[href="#"], a:not([href])');
  let count = 0;
  
  fakeLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === '#' || href === '' || href === null) {
      const hasOnClick = link.hasAttribute('onclick') || link.getAttribute('role') === 'button';
      
      if (hasOnClick) {
        link.setAttribute('role', 'button');
        
        if (!link.hasAttribute('tabindex')) {
          link.setAttribute('tabindex', '0');
        }
      }
      count++;
    }
  });
  
  return count;
}

function applyAccessibilityFixes(document) {
  const results = {
    langAttribute: addLangAttribute(document),
    tableFixes: fixTableStructure(document),
    mainLandmarks: addMainLandmark(document),
    uniqueLandmarks: ensureUniqueLandmarks(document),
    svgNames: addSvgAccessibleNames(document),
    fakeLinkFixes: fixFakeLinkIssue(document)
  };
  
  return results;
}

module.exports = {
  addLangAttribute,
  fixTableStructure,
  addMainLandmark,
  ensureUniqueLandmarks,
  addSvgAccessibleNames,
  fixFakeLinkIssue,
  applyAccessibilityFixes
};