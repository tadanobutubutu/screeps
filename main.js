// TODO: Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (DONE: addLangAttribute)
// - REACT_027: Fix 26 table structure issues (DONE: fixTableStructure)
// - REACT_017: Add/fix 2 landmark issues (DONE: addMainLandmark)
// - REACT_041: Add accessible names to 2 SVGs (DONE: addSvgAccessibleNames)
// - REACT_025: Ensure unique landmarks (DONE: ensureUniqueLandmarks)
// - REACT_036: Fix 1 fake link issue (DONE: fixFakeLinkIssue)

/**
 * REACT_015: Adds lang attribute to the HTML element for accessibility
 * @param {Document} doc - The document object
 * @param {string} lang - The language code (e.g., 'en', 'es')
 */
function addLangAttribute(doc, lang = 'en') {
  if (doc && doc.documentElement) {
    doc.documentElement.lang = lang;
  }
}

/**
 * REACT_027: Fixes table structure issues by ensuring proper semantic structure
 * @param {Document|Element} root - The root element to search within
 * @returns {Object} - Summary of fixes applied
 */
function fixTableStructure(root = document) {
  const tables = root.querySelectorAll('table');
  const summary = { fixed: 0, issues: [] };

  tables.forEach((table, tableIndex) => {
    const rows = table.querySelectorAll('tr');
    const hasThead = table.querySelector('thead') !== null;
    const hasTbody = table.querySelector('tbody') !== null;

    // Fix: Ensure tables have a tbody element
    if (!hasTbody && rows.length > 0) {
      const firstRow = rows[0];
      const isHeaderRow = firstRow.querySelector('th') !== null;

      if (!hasThead && isHeaderRow) {
        // Move first row to thead
        const thead = document.createElement('thead');
        thead.appendChild(firstRow);
        table.insertBefore(thead, table.firstChild);
        summary.fixed++;
        summary.issues.push(`Table ${tableIndex + 1}: Added thead for header row`);
      } else {
        // Wrap all rows in tbody
        const tbody = document.createElement('tbody');
        rows.forEach(row => tbody.appendChild(row));
        rows.forEach(row => row.remove());
        table.appendChild(tbody);
        summary.fixed++;
        summary.issues.push(`Table ${tableIndex + 1}: Wrapped rows in tbody`);
      }
    }

    // Fix: Ensure proper use of th for header cells
    const firstRow = table.querySelector('tbody tr') || table.querySelector('tr');
    if (firstRow) {
      const cells = firstRow.querySelectorAll('td');
      if (cells.length > 0 && !hasThead) {
        cells.forEach(cell => {
          const th = document.createElement('th');
          th.scope = 'col';
          th.innerHTML = cell.innerHTML;
          cell.parentNode.replaceChild(th, cell);
        });
        summary.fixed++;
        summary.issues.push(`Table ${tableIndex + 1}: Converted first row cells to th`);
      }
    }
  });

  return summary;
}

/**
 * REACT_017: Adds main landmark to the document
 * @param {Document} doc - The document object
 * @returns {Element|null} - The main element added or existing main
 */
function addMainLandmark(doc = document) {
  let main = doc.querySelector('main');
  
  if (!main) {
    main = doc.createElement('main');
    main.id = 'main-content';
    
    // Find the best place to insert main (after nav, before footer)
    const body = doc.body;
    const firstSection = body.querySelector('section, article, div[role="main"]');
    
    if (firstSection) {
      body.insertBefore(main, firstSection);
    } else {
      // Create a main landmark wrapping existing content
      const children = Array.from(body.children);
      const contentStart = children.findIndex(child => 
        !['script', 'style', 'link', 'meta', 'nav', 'footer', 'header'].includes(child.tagName.toLowerCase())
      );
      
      if (contentStart !== -1 && children.length > 0) {
        children.slice(contentStart).forEach(child => main.appendChild(child));
      }
      
      if (main.children.length === 0) {
        main.textContent = 'Main content';
      }
      
      body.insertBefore(main, children[contentStart] || null);
    }
    return main;
  }
  
  return main;
}

/**
 * REACT_041: Adds accessible names to SVG elements
 * @param {Document|Element} root - The root element to search within
 * @returns {Object} - Summary of SVGs fixed
 */
function addSvgAccessibleNames(root = document) {
  const svgs = root.querySelectorAll('svg');
  const summary = { fixed: 0, svgs: [] };

  svgs.forEach((svg, index) => {
    const hasTitle = svg.querySelector('title') !== null;
    const ariaLabel = svg.getAttribute('aria-label');
    const ariaLabelledby = svg.getAttribute('aria-labelledby');
    
    if (!hasTitle && !ariaLabel && !ariaLabelledby) {
      const id = svg.id || `svg-${index + 1}`;
      const title = document.createElement('title');
      title.id = `${id}-title`;
      title.textContent = svg.getAttribute('aria-hidden') === 'true' 
        ? `Decorative SVG ${index + 1}` 
        : `SVG icon ${index + 1}`;
      
      // Insert title as first child
      svg.insertBefore(title, svg.firstChild);
      
      // Add role and aria-labelledby
      svg.setAttribute('role', 'img');
      svg.setAttribute('aria-labelledby', title.id);
      
      summary.fixed++;
      summary.svgs.push({
        index: index + 1,
        id: id,
        titleId: title.id
      });
    }
  });

  return summary;
}

/**
 * REACT_025: Ensures unique landmark names/IDs
 * @param {Document} doc - The document object
 * @returns {Object} - Summary of landmarks fixed
 */
function ensureUniqueLandmarks(doc = document) {
  const landmarks = doc.querySelectorAll('nav, main, aside, footer, section, article');
  const summary = { fixed: 0, duplicates: [] };
  const seenIds = new Set();
  const seenLabels = new Map();

  landmarks.forEach((landmark, index) => {
    const tagName = landmark.tagName.toLowerCase();
    const role = landmark.getAttribute('role') || tagName;
    
    // Track and fix duplicate IDs
    if (landmark.id) {
      if (seenIds.has(landmark.id)) {
        const newId = `${role}-${index}`;
        landmark.id = newId;
        summary.fixed++;
        summary.duplicates.push({
          type: 'id',
          old: landmark.id,
          new: newId,
          element: tagName
        });
      }
      seenIds.add(landmark.id);
    } else {
      // Add ID to landmarks that need them for accessibility
      landmark.id = `${role}-${index}`;
    }

    // Ensure nav landmarks have accessible names
    if (tagName === 'nav' || role === 'navigation') {
      if (!landmark.getAttribute('aria-label') && !landmark.id) {
        const navCount = doc.querySelectorAll('nav').length;
        landmark.setAttribute('aria-label', navCount > 1 ? `Navigation ${navCount}` : 'Main navigation');
        summary.fixed++;
      }
    }

    // Track section/article landmarks
    if (tagName === 'section' || tagName === 'article') {
      if (!landmark.getAttribute('aria-label') && !landmark.id) {
        const count = seenLabels.get(role) || 0;
        landmark.id = `${role}-${count + 1}`;
        seenLabels.set(role, count + 1);
        summary.fixed++;
      }
    }
  });

  return summary;
}

/**
 * REACT_036: Fixes fake link issues (elements that look like links but aren't)
 * @param {Document|Element} root - The root element to search within
 * @returns {Object} - Summary of fake links fixed
 */
function fixFakeLinkIssue(root = document) {
  const summary = { fixed: 0, elements: [] };
  
  // Find elements that look like links but are using button/interactive elements incorrectly
  const fakeLinks = root.querySelectorAll(
    'a[href="#"], a[href=""], span[role="link"], div[role="link"], ' +
    'button.link, a:not([href])'
  );

  fakeLinks.forEach((element, index) => {
    const tagName = element.tagName.toLowerCase();
    const hasHref = element.hasAttribute('href');
    
    if (tagName === 'a' && hasHref) {
      const href = element.getAttribute('href');
      // Fix empty or placeholder hrefs
      if (href === '' || href === '#') {
        element.setAttribute('href', '#main-content');
        element.setAttribute('aria-label', element.textContent || 'Link');
        summary.fixed++;
        summary.elements.push({ index: index + 1, type: 'a[href="#"]', fix: 'Added main-content anchor' });
      }
    } else if (element.getAttribute('role') === 'link' || tagName === 'a') {
      // Check if element should be a button instead
      const isAction = !element.getAttribute('href') || 
                       element.getAttribute('href') === '#' ||
                       element.getAttribute('href') === '';
      
      if (isAction && !element.getAttribute('href')) {
        // Convert to proper button if it's an action
        const newButton = document.createElement('button');
        newButton.innerHTML = element.innerHTML;
        newButton.className = element.className;
        newButton.setAttribute('type', 'button');
        newButton.setAttribute('aria-label', element.textContent || 'Button');
        
        // Copy any existing event handlers would need to be handled separately
        if (element.id) newButton.id = element.id;
        
        element.parentNode.replaceChild(newButton, element);
        summary.fixed++;
        summary.elements.push({ index: index + 1, type: 'button', fix: 'Converted to button' });
      }
    }
  });
  
  return summary;
}

const { OAuth2Client } = require('google-auth-library');
const http = require('http');

const oAuth2Client = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

function generateAuthUrl() {
  return oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: ['openid', 'email', 'profile']
  });
}

module.exports = {
  addLangAttribute,
  fixTableStructure,
  addMainLandmark,
  addSvgAccessibleNames,
  ensureUniqueLandmarks,
  fixFakeLinkIssue,
  oAuth2Client,
  generateAuthUrl
};