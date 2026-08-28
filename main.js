// TODO: Add any other missing exports that might have been?
// Added missing exports as per the issue

/**
 * REACT_015: Add lang attribute to HTML element
 * Ensures the HTML element has a proper lang attribute for accessibility
 */
function addLangAttribute(document) {
  const htmlElement = document.querySelector('html');
  if (htmlElement && !htmlElement.hasAttribute('lang')) {
    htmlElement.setAttribute('lang', 'en');
  }
  return htmlElement;
}

/**
 * REACT_027: Fix table structure issues
 * Ensures proper table structure with th elements, scope attributes, and captions
 */
function fixTableStructure(document) {
  const tables = document.querySelectorAll('table');
  let fixCount = 0;
  
  tables.forEach(table => {
    // Add caption if missing
    if (!table.querySelector('caption')) {
      const caption = document.createElement('caption');
      caption.textContent = 'Data table';
      table.insertBefore(caption, table.firstChild);
      fixCount++;
    }
    
    // Ensure proper th usage
    const firstRow = table.querySelector('tr');
    if (firstRow) {
      const cells = firstRow.querySelectorAll('td');
      cells.forEach(cell => {
        const th = document.createElement('th');
        th.textContent = cell.textContent;
        th.setAttribute('scope', 'col');
        cell.parentNode.replaceChild(th, cell);
        fixCount++;
      });
    }
  });
  
  return fixCount;
}

/**
 * REACT_017: Add main landmark
 * Ensures the page has a proper main landmark for screen readers
 */
function addMainLandmark(document) {
  const mainElements = document.querySelectorAll('main');
  const mainId = 'main-content';
  
  if (mainElements.length === 0) {
    // Create main landmark if none exists
    const main = document.createElement('main');
    main.id = mainId;
    document.body.insertBefore(main, document.body.firstChild);
  } else if (!mainElements[0].id) {
    mainElements[0].id = mainId;
  }
  
  return document.querySelector('main');
}

/**
 * REACT_025: Ensure unique landmarks
 * Ensures all landmarks have unique identifiers to meet accessibility standards
 */
function ensureUniqueLandmarks(document) {
  const landmarks = ['header', 'nav', 'main', 'footer', 'aside'];
  const seenIds = new Set();
  
  landmarks.forEach(landmark => {
    const elements = document.querySelectorAll(landmark);
    elements.forEach((el, index) => {
      if (el.id) {
        if (seenIds.has(el.id)) {
          el.id = `${landmark}-${index}`;
        }
        seenIds.add(el.id);
      }
    });
  });
  
  return true;
}

/**
 * REACT_041: Add accessible names to SVGs
 * Ensures all SVG elements have accessible title or aria-label attributes
 */
function addSvgAccessibleNames(document) {
  const svgs = document.querySelectorAll('svg');
  let fixCount = 0;
  
  svgs.forEach(svg => {
    if (!svg.getAttribute('aria-label') && !svg.getAttribute('aria-labelledby')) {
      const title = svg.querySelector('title');
      if (!title) {
        const newTitle = document.createElement('title');
        newTitle.textContent = 'Decorative graphic';
        svg.insertBefore(newTitle, svg.firstChild);
        fixCount++;
      }
      
      const titleId = `svg-title-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      if (title) {
        title.id = titleId;
        svg.setAttribute('aria-labelledby', titleId);
        fixCount++;
      }
    }
  });
  
  return fixCount;
}

/**
 * REACT_036: Fix fake link issue
 * Converts elements that look like links but aren't (<div onclick>, <span href>, etc.) to proper links or buttons
 */
function fixFakeLinkIssue(document) {
  const fakeLinks = document.querySelectorAll('[onclick][role="link"], [onclick][href]:not(a)');
  let fixCount = 0;
  
  fakeLinks.forEach(element => {
    const tagName = element.tagName.toLowerCase();
    
    if (tagName === 'div' || tagName === 'span') {
      // Convert to button if it's an action
      if (element.getAttribute('onclick')) {
        element.setAttribute('role', 'button');
        fixCount++;
      }
      // Convert to anchor if it's a navigation
      if (element.getAttribute('href') && tagName !== 'a') {
        const newAnchor = document.createElement('a');
        newAnchor.innerHTML = element.innerHTML;
        newAnchor.href = element.getAttribute('href');
        if (element.className) newAnchor.className = element.className;
        element.parentNode.replaceChild(newAnchor, element);
        fixCount++;
      }
    }
  });
  
  return fixCount;
}

// Export all accessibility functions
module.exports = {
  addLangAttribute,
  fixTableStructure,
  addMainLandmark,
  ensureUniqueLandmarks,
  addSvgAccessibleNames,
  fixFakeLinkIssue
};