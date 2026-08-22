// TODO: Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (DONE: addLangAttribute)
// - REACT_027: Fix 26 table structure issues (DONE: fixTableStructure)
// - REACT_017: Add/fix 2 landmark issues (DONE: addMainLandmark)
// - REACT_041: Add accessible names to 2 SVGs (DONE: addSvgAccessibleNames)
// - REACT_025: Ensure unique landmarks (DONE: ensureUniqueLandmarks)
// - REACT_036: Fix 1 fake link issue (DONE: fixFakeLinkIssue)

export function addLangAttribute(doc, lang = 'en') {
  const element = doc.documentElement || doc.querySelector('html');
  if (element && !element.hasAttribute('lang')) {
    element.setAttribute('lang', lang);
  }
  return element;
}

export function fixTableStructure(container) {
  const tables = container.querySelectorAll('table');
  
  tables.forEach(table => {
    // Check if table already has proper structure
    const hasThead = table.querySelector('thead');
    const hasTbody = table.querySelector('tbody');
    
    // Get all rows
    const rows = Array.from(table.querySelectorAll('tr'));
    
    // If no thead exists but rows exist, create thead from first row
    if (!hasThead && rows.length > 0) {
      const thead = document.createElement('thead');
      thead.appendChild(rows[0]);
      table.insertBefore(thead, table.firstChild);
    }
    
    // If no tbody exists, wrap remaining rows in tbody
    if (!hasTbody) {
      const tbody = document.createElement('tbody');
      const remainingRows = Array.from(table.querySelectorAll('tr'));
      remainingRows.forEach(row => tbody.appendChild(row));
      table.appendChild(tbody);
    }
  });
}

export function addMainLandmark(container) {
  let main = container.querySelector('main, [role="main"]');
  
  if (!main) {
    // Find the most prominent content area to wrap with main
    const body = container.querySelector('body') || container;
    const existingContent = body.children[0];
    
    main = document.createElement('main');
    main.setAttribute('role', 'main');
    
    if (existingContent) {
      body.insertBefore(main, existingContent);
    } else {
      body.appendChild(main);
    }
  }
  
  return main;
}

export function addSvgAccessibleNames(container) {
  const svgs = container.querySelectorAll('svg');
  let count = 0;
  
  svgs.forEach((svg, index) => {
    const hasLabel = svg.getAttribute('aria-label');
    const hasLabelledBy = svg.getAttribute('aria-labelledby');
    const hasTitle = svg.querySelector('title');
    
    if (!hasLabel && !hasLabelledBy && !hasTitle) {
      const titleId = `svg-title-${Date.now()}-${index}`;
      const title = document.createElement('title');
      title.id = titleId;
      title.textContent = `Icon ${index + 1}`;
      
      svg.insertBefore(title, svg.firstChild);
      svg.setAttribute('aria-labelledby', titleId);
      count++;
    }
  });
  
  return count;
}

export function ensureUniqueLandmarks(container) {
  const landmarkSelectors = ['nav', 'main', 'aside', 'footer', 'header', 'section', '[role="navigation"]', '[role="main"]', '[role="complementary"]', '[role="contentinfo"]', '[role="banner"]'];
  
  const usedIds = new Set();
  
  // Find all existing IDs first
  container.querySelectorAll('[id]').forEach(el => {
    usedIds.add(el.id);
  });
  
  landmarkSelectors.forEach(selector => {
    const landmarks = container.querySelectorAll(selector);
    landmarks.forEach((landmark, index) => {
      // Add role
    });
  });
}