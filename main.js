// TODO: This is the existing code that needs to be preserved
// Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (handled by getLangAttribute() and addLangAttribute())
// - REACT_027: Fix 26 table structure issues (handled by validateTableAccessibility(), validateTableStructure() and fixTableStructure())
// - REACT_017: Add/fix 2 landmark issues (handled by addMainLandmark(), validateLandmark(), validateLandmarkStructure() and ...)
// - REACT_041: Add accessible names to 2 SVGs (handled by getSvgAccessibleName() and setSvgAttributes())
// - REACT_025: Ensure unique landmarks (DONE: ensureUniqueLandmarks)
// - REACT_036: Fix 1 fake link issue (handled by createInPageButton(), validateLinkAccessibility() and handleFakeLinks())
// - REACT_037: Add proper landmark regions (DONE: addProperLandmarkRegions)

// REACT_015: Lang attribute functions
function getLangAttribute() {
  return document.documentElement.getAttribute('lang');
}

function addLangAttribute(lang = 'en') {
  if (!document.documentElement.hasAttribute('lang')) {
    document.documentElement.setAttribute('lang', lang);
  }
}

// REACT_027: Table accessibility functions
function validateTableAccessibility(table) {
  const issues = [];
  if (!table.hasAttribute('caption')) {
    issues.push('Table missing caption');
  }
  if (table.querySelector('th') && !table.querySelector('td[headers]' && !table.hasAttribute('scope'))) {
    issues.push('Table headers missing scope or td headers attribute');
  }
  return issues;
}

function validateTableStructure(table) {
  const issues = [];
  const rows = table.querySelectorAll('tr');
  const cellCount = rows[0] ? rows[0].querySelectorAll('th, td').length : 0;
  
  rows.forEach((row, index) => {
    const rowCells = row.querySelectorAll('th, td').length;
    if (rowCells !== cellCount && index > 0) {
      issues.push(`Row ${index + 1} has inconsistent cell count`);
    }
  });
  
  return issues;
}

function fixTableStructure(table) {
  const rows = table.querySelectorAll('tr');
  let maxCells = 0;
  
  rows.forEach(row => {
    const cells = row.querySelectorAll('th, td').length;
    if (cells > maxCells) maxCells = cells;
  });
  
  rows.forEach(row => {
    const cells = row.querySelectorAll('th, td').length;
    if (cells < maxCells) {
      const diff = maxCells - cells;
      for (let i = 0; i < diff; i++) {
        const cell = document.createElement('td');
        row.appendChild(cell);
      }
    }
  });
}

// REACT_017: Landmark functions
function addMainLandmark() {
  const mainElements = document.querySelectorAll('main');
  if (mainElements.length === 0) {
    const main = document.createElement('main');
    const body = document.body;
    if (body.firstChild) {
      body.insertBefore(main, body.firstChild);
    } else {
      body.appendChild(main);
    }
  }
}

function validateLandmark(element) {
  const validLandmarks = ['header', 'nav', 'main', 'aside', 'footer', 'article', 'section'];
  return validLandmarks.includes(element.tagName.toLowerCase());
}

function validateLandmarkStructure() {
  const issues = [];
  const landmarks = document.querySelectorAll('header, nav, main, aside, footer');
  
  landmarks.forEach(landmark => {
    if (!validateLandmark(landmark)) {
      issues.push(`Invalid landmark: ${landmark.tagName}`);
    }
  });
  
  const mainCount = document.querySelectorAll('main').length;
  if (mainCount === 0) {
    issues.push('Missing main landmark');
  } else if (mainCount > 1) {
    issues.push(`Multiple main landmarks found: ${mainCount}`);
  }
  
  return issues;
}

// REACT_041: SVG accessibility functions
function getSvgAccessibleName(svg) {
  const title = svg.querySelector('title');
  const desc = svg.querySelector('desc');
  return {
    title: title ? title.textContent : null,
    desc: desc ? desc.textContent : null
  };
}

function setSvgAttributes(svg, name) {
  if (!svg.hasAttribute('role')) {
    svg.setAttribute('role', 'img');
  }
  
  let title = svg.querySelector('title');
  if (!title && name) {
    title = document.createElement('title');
    title.textContent = name;
    svg.insertBefore(title, svg.firstChild);
  }
  
  if (!svg.hasAttribute('aria-label') && !svg.querySelector('title')) {
    svg.setAttribute('aria-label', name || 'SVG image');
  }
}

// REACT_025: Ensure unique landmarks
function ensureUniqueLandmarks() {
  const landmarks = ['header', 'main', 'footer', 'nav', 'aside'];
  
  landmarks.forEach(landmark => {
    const elements = document.querySelectorAll(landmark);
    if (elements.length > 1) {
      elements.forEach((el, index) => {
        if (index === 0) {
          if (!el.hasAttribute('role')) {
            el.setAttribute('role', landmark);
          }
        } else {
          if (!el.hasAttribute('aria-label')) {
            el.setAttribute('aria-label', `${landmark}-${index + 1}`);
          }
        }
      });
    }
  });
}

// REACT_036: Fake link handling functions
function createInPageButton(link) {
  const button = document.createElement('button');
  button.textContent = link.textContent;
  button.className = link.className;
  return button;
}

function validateLinkAccessibility(link) {
  const issues = [];
  const href = link.getAttribute('href');
  
  if (href && (href.startsWith('#') || href === '')) {
    issues.push('Potential fake link detected');
  }
  
  if (!link.hasAttribute('aria-label') && !link.textContent.trim()) {
    issues.push('Link missing accessible name');
  }
  
  return issues;
}

function handleFakeLinks() {
  const links = document.querySelectorAll('a');
  const fakeLinks = [];
  
  links.forEach(link => {
    const href = link.getAttribute('href');
    if (href && (href.startsWith('#') || href === '')) {
      const issues = validateLinkAccessibility(link);
      if (issues.length > 0) {
        fakeLinks.push({ link, issues });
        
        const button = createInPageButton(link);
        button.onclick = () => {
          if (href.startsWith('#')) {
            const target = document.querySelector(href);
            if (target) {
              target.scrollIntoView({ behavior: 'smooth' });
            }
          }
        };
        
        link.parentNode.replaceChild(button, link);
      }
    }
  });
  
  return fakeLinks;
}

// REACT_037: Add proper landmark regions
function addProperLandmarkRegions() {
  const existingRoles = {
    banner: document.querySelector('[role="banner"]'),
    navigation: document.querySelector('[role="navigation"]'),
    main: document.querySelector('[role="main"]'),
    contentinfo: document.querySelector('[role="contentinfo"]'),
    complementary: document.querySelector('[role="complementary"]')
  };
  
  if (!existingRoles.banner && !document.querySelector('header')) {
    const header = document.createElement('header');
    header.setAttribute('role', 'banner');
    document.body.insertBefore(header, document.body.firstChild);
  }
  
  if (!existingRoles.navigation && !document.querySelector('nav')) {
    const nav = document.createElement('nav');
    nav.setAttribute('role', 'navigation');
    nav.setAttribute('aria-label', 'Main navigation');
    const header = document.querySelector('header') || document.querySelector('[role="banner"]');
    if (header) {
      header.appendChild(nav);
    } else {
      document.body.insertBefore(nav, document.body.firstChild);
    }
  }
  
  if (!existingRoles.contentinfo && !document.querySelector('footer')) {
    const footer = document.createElement('footer');
    footer.setAttribute('role', 'contentinfo');
    document.body.appendChild(footer);
  }
}

// Initialize accessibility improvements
function initializeAccessibility() {
  addLangAttribute();
  addMainLandmark();
  ensureUniqueLandmarks();
  addProperLandmarkRegions();
  handleFakeLinks();
  
  document.querySelectorAll('svg').forEach(svg => {
    const name = getSvgAccessibleName(svg);
    setSvgAttributes(svg, name.title || 'SVG image');
  });
  
  document.querySelectorAll('table').forEach(table => {
    validateTableAccessibility(table);
    validateTableStructure(table);
  });
}

// Export functions for testing
module.exports = {
  getLangAttribute,
  addLangAttribute,
  validateTableAccessibility,
  validateTableStructure,
  fixTableStructure,
  addMainLandmark,
  validateLandmark,
  validateLandmarkStructure,
  getSvgAccessibleName,
  setSvgAttributes,
  ensureUniqueLandmarks,
  createInPageButton,
  validateLinkAccessibility,
  handleFakeLinks,
  addProperLandmarkRegions,
  initializeAccessibility
};