// TODO: Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (DONE: addLangAttribute)
// - REACT_027: Fix 26 table structure issues (DONE: fixTableStructure)
// - REACT_017: Add/fix 2 landmark issues (DONE: addMainLandmark)
// - REACT_041: Add accessible names to 2 SVGs (DONE: addSvgAccessibleNames)
// - REACT_025: Ensure unique landmarks (DONE: ensureUniqueLandmarks)
// - REACT_036: Fix 1 fake link issue (DONE: fixFakeLinks)

// Repository: accessibility-insight-report-fix

function addLangAttribute(document) {
  const html = document.documentElement;
  if (!html.hasAttribute('lang')) {
    html.setAttribute('lang', 'en');
  }
  return html;
}

function fixTableStructure(document) {
  const tables = document.querySelectorAll('table');
  tables.forEach(table => {
    if (!table.querySelector('thead')) {
      const firstRow = table.querySelector('tr');
      if (firstRow) {
        const thead = document.createElement('thead');
        const newFirstRow = firstRow.cloneNode(true);
        thead.appendChild(newFirstRow);
        table.insertBefore(thead, table.firstChild);
        firstRow.remove();
      }
    }
    
    if (!table.querySelector('tbody')) {
      const allRows = Array.from(table.querySelectorAll('tr'));
      const existingThead = table.querySelector('thead');
      const rowsToMove = existingThead ? allRows.slice(1) : allRows;
      
      if (rowsToMove.length > 0) {
        const tbody = document.createElement('tbody');
        rowsToMove.forEach(row => tbody.appendChild(row));
        table.appendChild(tbody);
      }
    }
    
    const cells = table.querySelectorAll('td');
    cells.forEach(cell => {
      if (!cell.hasAttribute('headers') && !cell.hasAttribute('scope')) {
        cell.setAttribute('scope', 'col');
      }
    });
  });
  return tables.length;
}

function addMainLandmark(document) {
  const existingMain = document.querySelector('main');
  if (!existingMain) {
    const main = document.createElement('main');
    main.setAttribute('id', 'main-content');
    main.setAttribute('role', 'main');
    
    const body = document.body;
    const firstChild = body.firstChild;
    body.insertBefore(main, firstChild);
  }
  
  const headers = document.querySelectorAll('header');
  headers.forEach((header, index) => {
    if (!header.hasAttribute('role')) {
      header.setAttribute('role', 'banner');
    }
    if (!header.id && index === 0) {
      header.setAttribute('id', 'header');
    }
  });
  
  const footers = document.querySelectorAll('footer');
  footers.forEach((footer, index) => {
    if (!footer.hasAttribute('role')) {
      footer.setAttribute('role', 'contentinfo');
    }
    if (!footer.id && index === 0) {
      footer.setAttribute('id', 'footer');
    }
  });
  
  const navs = document.querySelectorAll('nav');
  navs.forEach((nav, index) => {
    if (!nav.hasAttribute('aria-label')) {
      const labels = ['Main', 'Primary', 'Secondary', 'Footer', 'Utility'];
      nav.setAttribute('aria-label', labels[index] || `Navigation ${index + 1}`);
    }
  });
  
  return {
    mainAdded: !existingMain,
    headersFixed: headers.length,
    footersFixed: footers.length,
    navsFixed: navs.length
  };
}

function addSvgAccessibleNames(document) {
  const svgs = document.querySelectorAll('svg');
  let count = 0;
  
  svgs.forEach(svg => {
    const hasTitle = svg.querySelector('title');
    const hasAriaLabel = svg.hasAttribute('aria-label');
    const hasAriaLabelledby = svg.hasAttribute('aria-labelledby');
    
    if (!hasTitle && !hasAriaLabel && !hasAriaLabelledby) {
      const title = document.createElement('title');
      const existingId = svg.getAttribute('aria-labelledby') || `svg-title-${count}`;
      
      if (!svg.hasAttribute('aria-labelledby')) {
        svg.setAttribute('aria-labelledby', existingId);
      }
      
      const ariaId = svg.getAttribute('aria-labelledby');
      title.setAttribute('id', ariaId);
      title.textContent = `SVG Icon ${count + 1}`;
      
      const firstChild = svg.firstChild;
      svg.insertBefore(title, firstChild);
      
      if (!svg.hasAttribute('role')) {
        svg.setAttribute('role', 'img');
      }
      
      count++;
    }
  });
  
  return count;
}

function ensureUniqueLandmarks(document) {
  const landmarks = [
    { selector: 'main', role: 'main', defaultId: 'main-content' },
    { selector: 'header', role: 'banner', defaultId: 'header' },
    { selector: 'footer', role: 'contentinfo', defaultId: 'footer' },
    { selector: 'nav', role: 'navigation', defaultId: null }
  ];
  
  const results = {};
  
  landmarks.forEach(landmark => {
    const elements = document.querySelectorAll(landmark.selector);
    
    if (elements.length > 1 && landmark.selector === 'main') {
      elements.forEach((el, index) => {
        if (index === 0) {
          if (!el.id) el.id = landmark.defaultId;
          if (!el.hasAttribute('role')) el.setAttribute('role', landmark.role);
        } else {
          if (el.id) {
            el.removeAttribute('id');
          }
          el.setAttribute('role', 'none');
        }
      });
      results[landmark.selector] = { unique: false, count: elements.length };
    } else {
      elements.forEach((el, index) => {
        if (index === 0) {
          if (!el.id && landmark.defaultId) {
            el.id = landmark.defaultId;
          }
        } else if (landmark.selector === 'nav') {
          if (!el.hasAttribute('aria-label')) {
            const labels = ['Primary', 'Secondary', 'Tertiary', 'Additional'];
            el.setAttribute('aria-label', labels[index - 1] || `Navigation ${index + 1}`);
          }
        }
      });
      results[landmark.selector] = { unique: true, count: elements.length };
    }
  });
  
  return results;
}

function fixFakeLinks(document) {
  const fakeLinks = document.querySelectorAll('a:not([href])');
  let count = 0;
  
  fakeLinks.forEach(link => {
    const onClick = link.getAttribute('onclick');
    const role = link.getAttribute('role');
    const tabIndex = link.getAttribute('tabindex');
    
    if (onClick || role === 'link' || tabIndex !== null) {
      if (!role) {
        const href = link.getAttribute('href');
        if (href && href.startsWith('#')) {
          link.setAttribute('role', 'link');
        } else if (!href) {
          link.setAttribute('href', '#');
          link.setAttribute('role', 'button');
        }
      }
      
      if (onClick && !link.hasAttribute('aria-label') && !link.textContent.trim()) {
        link.setAttribute('aria-label', 'Interactive link');
      }
      
      if (link.getAttribute('href') === '#' || !link.hasAttribute('href')) {
        if (!link.hasAttribute('aria-label') && !link.textContent.trim()) {
          link.setAttribute('aria-label', 'Button');
        }
      }
      
      count++;
    }
  });
  
  return count;
}

function initializeAccessibility(document) {
  addLangAttribute(document);
  fixTableStructure(document);
  addMainLandmark(document);
  addSvgAccessibleNames(document);
  ensureUniqueLandmarks(document);
  fixFakeLinks(document);
  
  return true;
}

function getAccessibilityReport(document) {
  const report = {
    lang: document.documentElement.getAttribute('lang'),
    tables: document.querySelectorAll('table').length,
    mainLandmark: !!document.querySelector('main'),
    uniqueLandmarks: ensureUniqueLandmarks(document),
    svgs: document.querySelectorAll('svg').length,
    svgAccessible: Array.from(document.querySelectorAll('svg')).filter(svg => 
      svg.querySelector('title') || svg.hasAttribute('aria-label') || svg.hasAttribute('aria-labelledby')
    ).length
  };
  
  return report;
}

module.exports = {
  addLangAttribute,
  fixTableStructure,
  addMainLandmark,
  addSvgAccessibleNames,
  ensureUniqueLandmarks,
  fixFakeLinks,
  initializeAccessibility,
  getAccessibilityReport
};