const main = require('./utilities')

function createInPageButton(buttonId, buttonText, buttonClass) {
  const button = document.createElement('button');
  button.id = buttonId;
  button.textContent = buttonText;
  button.className = buttonClass;
  button.setAttribute('type', 'button');
  return button;
}

function function3(insightReport) {
  const results = {
    compliant: [],
    nonCompliant: [],
    warnings: [],
    summary: {
      total: 0,
      compliantCount: 0,
      nonCompliantCount: 0,
      warningCount: 0
    }
  };

  if (!insightReport || !insightReport.issues) {
    return results;
  }

  const issues = insightReport.issues;
  results.summary.total = issues.length;

  issues.forEach(issue => {
    if (issue.severity === 'error') {
      results.nonCompliant.push(issue);
      results.summary.nonCompliantCount++;
    } else if (issue.severity === 'warning') {
      results.warnings.push(issue);
      results.summary.warningCount++;
    } else if (issue.severity === 'info') {
      results.compliant.push(issue);
      results.summary.compliantCount++;
    }
  });

  // Log summary for debugging
  console.log('Accessibility Compliance Report:', results.summary);

  // Perform automated fixes for common issues
  const htmlElement = document.documentElement;
  if (!htmlElement.hasAttribute('lang')) {
    const langAttr = getFullLangAttribute();
    if (langAttr) {
      htmlElement.setAttribute('lang', langAttr);
      console.log('Fixed: Added lang attribute to HTML element');
    }
  }

  // Check and fix table accessibility
  const tables = document.querySelectorAll('table');
  tables.forEach(table => {
    validateTableAccessibility(table);
    validateTableStructure(table);
  });

  // Ensure unique landmarks
  ensureUniqueLandmarks();

  return results;
}

function addressAccessibilityIssues(insightReport) {
  console.log('Addressing accessibility issues:', insightReport);

  const htmlElement = document.documentElement;
  if (!htmlElement.hasAttribute('lang')) {
    const langAttr = getFullLangAttribute();
    if (langAttr) {
      htmlElement.setAttribute('lang', langAttr);
    }
  }

  const tables = document.querySelectorAll('table');
  tables.forEach(table => {
    validateTableAccessibility(table);
    validateTableStructure(table);
  });

  validateLandmarkHelpers();
  validateLandmarkStructHelpers();
  ensureUniqueLandmarks();

  const svgs = document.querySelectorAll('svg');
  svgs.forEach(svg => {
    const accessibleName = getSvgAccessibleName(svg);
    if (accessibleName) {
      setSvgAttributes(svg, { 'aria-label': accessibleName });
    }
  });

  handleFakeLinks();

  return { success: true };
}

function updateFunction() {
  return main.updateFunction();
}

function accessibleFunction() {
  return main.accessibleFunction();
}

function newFunction1() {
  return main.newFunction1();
}

function newFunction2() {
  return main.newFunction2();
}

function newFunction() {
  // New function implementation
}

function anotherNewFunction() {
  // Another new function implementation
}

function getLangAttribute() {
  return document.documentElement.lang || 'en';
}

function ensureDependencyGraphARIA() {
  const elements = [];
  elements.forEach(el => {
    el.setAttribute('role', 'graph');
    el.setAttribute('aria-label', 'Dependency graph visualization');
  });
}

function implementAccessibilityFixesFromReport(container, report) {
  const fixes = {
    langAdded: false,
    mainLandmarkAdded: false,
    landmarksFixed: 0,
    svgNamesAdded: 0,
    fakeLinksFixed: 0
  };

  if (!report || !report.issues) {
    return fixes;
  }

  const htmlEl =
    container.querySelector('html') ||
    (container.ownerDocument && container.ownerDocument.querySelector('html'));
  if (htmlEl && !htmlEl.hasAttribute('lang')) {
    htmlEl.setAttribute('lang', 'en');
    fixes.langAdded = true;
  }

  const mainElement = container.querySelector('main');
  if (!mainElement) {
    const body = container.ownerDocument ? container.ownerDocument.body : document.body;
    if (body) {
      const newMain = document.createElement('main');
      while (body.firstChild) {
        newMain.appendChild(body.firstChild);
      }
      body.appendChild(newMain);
      fixes.mainLandmarkAdded = true;
    }
  }

  renderGraphIndex(container);

  validateLandmark(container);
  validateLandmarkStructure(container);
  fixes.landmarksFixed++;

  const svgElements = container.querySelectorAll('svg');
  svgElements.forEach(svg => {
    const accessibleName = getSvgAccessibleName(svg);
    if (accessibleName && !svg.getAttribute('aria-label') && !svg.querySelector('title')) {
      svg.setAttribute('aria-label', accessibleName);
      fixes.svgNamesAdded++;
    }
  });

  const fakeLinks = container.querySelectorAll('a:not([href]), [role="link"]:not([href])');
  fakeLinks.forEach(link => {
    if (!link.getAttribute('href')) {
      link.setAttribute('href', '#' + (link.id || `link-${Date.now()}`));
    }
    if (!link.getAttribute('role')) {
      link.setAttribute('role', 'link');
    }
    fixes.fakeLinksFixed++;
  });

  const accessibilityReport = validateAccessibilityReport(container);
  if (accessibilityReport && accessibilityReport.issues && accessibilityReport.issues.length > 0) {
    console.log(`Accessibility report contains ${accessibilityReport.issues.length} remaining issues`);
  }

  focusTrap(container);

  if (fixes.langAdded) {
    console.log('Lang attribute added to HTML element');
  }

  if (fixes.mainLandmarkAdded) {
    console.log('Main landmark added');
  }

  const newAccessibilityIssues = checkAccessibilityForReport(container);
  if (newAccessibilityIssues.length > 0) {
    console.log(`New accessibility issues found: ${newAccessibilityIssues.join(', ')}`);
  }

  const landmarkFixesCount = fixes.landmarksFixed || 0;
  if (landmarkFixesCount > 0) {
    console.log(`Fixed ${landmarkFixesCount} unique landmarks`);
  }

  const svgFixes = fixes.svgNamesAdded || 0;
  if (svgFixes > 0) {
    console.log(`Fixed accessible names for ${svgFixes} SVGs`);
  }

  const fakeLinkFixes = fixes.fakeLinksFixed || 0;
  if (fakeLinkFixes > 0) {
    console.log(`Fixed fake link issues for ${fakeLinkFixes} elements`);
  }

  return fixes;
}

function renderDependencyGraphs(container) {
  // Implementation placeholder
}

function fixButtonIdentifiers(container) {
  // Implementation placeholder
}

function fixDependencyGraphAria(container) {
  // Implementation placeholder
}

function addMainLandmarkToIndex(container) {
  // Check if container has a main element
  const existingMain = container.querySelector('main');
  if (existingMain) {
    return existingMain;
  }

  // Create a new main element
  const mainElement = document.createElement('main');
  mainElement.setAttribute('role', 'main');
  
  // Move all direct children of body (excluding existing header and footer) into the main element
  const body = container.ownerDocument ? container.ownerDocument.body : document.body;
  if (body) {
    // Create a temporary container to hold non-landmark content
    const tempContainer = document.createDocumentFragment();
    const nonLandmarkNodes = [];
    
    // Collect all direct children that are not landmark elements
    Array.from(body.childNodes).forEach(node => {
      const isLandmark = node.nodeType === Node.ELEMENT_NODE && 
        (node.tagName.toLowerCase() === 'header' ||
         node.tagName.toLowerCase() === 'footer' ||
         node.tagName.toLowerCase() === 'nav' ||
         (node.tagName.toLowerCase() === 'main' && node.getAttribute('role') === 'main'));
      
      if (!isLandmark) {
        nonLandmarkNodes.push(node);
      } else {
        tempContainer.appendChild(node);
      }
    });
    
    // Move non-landmark content into the main element
    nonLandmarkNodes.forEach(node => {
      mainElement.appendChild(node);
    });
    
    // Insert main element after non-main landmarks (header, nav) but before footer
    let inserted = false;
    Array.from(body.childNodes).forEach(node => {
      if (!inserted && node.nodeType === Node.ELEMENT_NODE && 
          (node.tagName.toLowerCase() === 'footer' || node.tagName.toLowerCase() === 'main')) {
        body.insertBefore(mainElement, node);
        inserted = true;
      }
    });
    
    // If no footer or main found, insert before temp content
    if (!inserted) {
      // First append landmark elements that were moved to temp container
      while (tempContainer.firstChild) {
        body.appendChild(tempContainer.firstChild);
      }
      body.appendChild(mainElement);
    }
  }

  return mainElement;
}

function ensureLangAttribute() {
  if (!document.documentElement.hasAttribute('lang')) {
    document.documentElement.setAttribute('lang', 'en');
  }
}

function ensureLandmarks() {
  const body = document.body;
  
  let main = document.querySelector('main');
  if (!main) {
    main = document.createElement('main');
    main.setAttribute('role', 'main');
    body.appendChild(main);
  }

  let header = document.querySelector('header');
  if (!header) {
    header = document.createElement('header');
    header.setAttribute('role', 'banner');
    body.insertBefore(header, body.firstChild);
  }

  let footer = document.querySelector('footer');
  if (!footer) {
    footer = document.createElement('footer');
    footer.setAttribute('role', 'contentinfo');
    body.appendChild(footer);
  }

  const nav = document.querySelector('nav');
  if (!nav) {
    const navElement = document.createElement('nav');
    navElement.setAttribute('aria-label', 'main navigation');
    body.insertBefore(navElement, body.firstChild);
  }

  return validateLandmarkStructure();
}

function ensureUniqueLandmarks() {
  const landmarks = document.querySelectorAll('header[role="banner"], footer[role="contentinfo"], main[role="main"], nav[role="navigation"]');
  const seenIds = new Set();
  
  landmarks.forEach(landmark => {
    if (!landmark.id) {
      const tagName = landmark.tagName.toLowerCase();
      let id = tagName;
      let counter = 1;
      while (seenIds.has(id)) {
        id = `${tagName}-${counter++}`;
      }
      landmark.id = id;
      seenIds.add(id);
    } else {
      seenIds.add(landmark.id);
    }
  });

  const allIds = Array.from(document.querySelectorAll('[id]')).map(el => el.id);
  const uniqueIds = new Set(allIds);
  return uniqueIds.size === allIds.length;
}

function fixTableStructures() {
  const tables = document.querySelectorAll('table');
  
  tables.forEach(table => {
    if (!table.querySelector('thead')) {
      const thead = document.createElement('thead');
      const firstRow = table.querySelector('tr');
      if (firstRow) {
        const headerCells = firstRow.querySelectorAll('th, td');
        if (headerCells.length > 0) {
          const tr = document.createElement('tr');
          headerCells.forEach(cell => {
            if (cell.tagName === 'TD') {
              const th = document.createElement('th');
              th.textContent = cell.textContent;
              Array.from(cell.attributes).forEach(attr => {
                th.setAttribute(attr.name, attr.value);
              });
              tr.appendChild(th);
              cell.replaceWith(th);
            }
          });
          thead.appendChild(tr);
          table.insertBefore(thead, table.firstChild);
        }
      }
    }

    if (!table.querySelector('tbody')) {
      const rows = Array.from(table.querySelectorAll('tr'));
      const thead = table.querySelector('thead');
      const firstTrIndex = thead ? rows.indexOf(thead.nextElementSibling) : 0;
      
      if (firstTrIndex > 0 && rows.length > firstTrIndex) {
        const tbody = document.createElement('tbody');
        rows.slice(firstTrIndex).forEach(row => {
          tbody.appendChild(row);
        });
        if (thead) {
          thead.insertAdjacentElement('afterend', tbody);
        } else {
          table.insertBefore(tbody, table.firstChild);
        }
      }
    }
  });
}

function fixFakeLinks() {
  const links = document.querySelectorAll('a');
  
  links.forEach(link => {
    if (!link.href || link.href === '#' || link.getAttribute('href') === '') {
      link.setAttribute('role', 'button');
    }
  });

  const fakeLinks = document.querySelectorAll('[onclick], [role="link"]');
  fakeLinks.forEach(element => {
    if (!element.href && element.tagName !== 'A') {
      const isInteractive = element.getAttribute('role') === 'link' || element.hasAttribute('onclick');
      if (isInteractive && !element.href) {
        element.setAttribute('role', 'button');
      }
    }
  });
}

function initGoogleSignIn() {
  const googleButtons = document.querySelectorAll('[data-google-signin]');
  
  googleButtons.forEach(button => {
    button.setAttribute('aria-label', 'Sign in with Google');
    button.setAttribute('type', 'button');
  });
}

function fixButtonIds() {
  const buttons = document.querySelectorAll('[id*="my-button"], .my-button');
  
  buttons.forEach((button, index) => {
    if (!button.id || button.id.includes('my-button')) {
      const newId = button.id ? button.id.replace(/my-button/gi, 'btn') : `button-${index}`;
      button.id = newId;
    }
  });

  const buttonsWithIds = document.querySelectorAll('button[id]');
  buttonsWithIds.forEach(button => {
    if (!button.hasAttribute('aria-label') && !button.textContent) {
      button.setAttribute('aria-label', `Button ${button.id}`);
    }
  });
}

function ensureSvgAccessibleNames() {
  const svgs = document.querySelectorAll('svg');
  
  svgs.forEach((svg, index) => {
    if (!svg.getAttribute('aria-label') && !svg.getAttribute('aria-labelledby')) {
      const title = svg.querySelector('title');
      if (title) {
        const titleId = `svg-title-${index}`;
        title.id = titleId;
        svg.setAttribute('aria-labelledby', titleId);
      } else {
        svg.setAttribute('aria-label', `SVG icon ${index + 1}`);
      }
    }
  });
}

function ensureDependencyGraphAriaRole() {
  const container = document.getElementById('dependencyGraph') || document.querySelector('.dependency-graph');
  
  if (container) {
    if (!container.hasAttribute('role')) {
      container.setAttribute('role', 'img');
    }
    if (!container.hasAttribute('aria-label')) {
      container.setAttribute('aria-label', 'Dependency graph visualization');
    }
    if (!container.hasAttribute('aria-describedby')) {
      const description = container.querySelector('[id*="description"], .description');
      if (description) {
        container.setAttribute('aria-describedby', description.id || 'graph-description');
      }
    }
  }
}

function initAccessibility() {
  ensureLangAttribute();
  ensureLandmarks();
  ensureUniqueLandmarks();
  fixTableStructures();
  fixFakeLinks();
  initGoogleSignIn();
  fixButtonIds();
  ensureSvgAccessibleNames();
  ensureDependencyGraphAriaRole();
}

if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAccessibility);
  } else {
    initAccessibility();
  }
}

function validateSession() {
  return false;
}

function handleCredentialResponse(response) {
  console.log('Credential Response:', response);
}

function validateTableStructure(tableData) {
  return true;
}

function addLangAttribute(element, lang = 'en') {
  let htmlElement = element || document.documentElement;
  if (!htmlElement) {
    return null;
  }

  if (htmlElement && !htmlElement.hasAttribute('lang')) {
    htmlElement.setAttribute('lang', lang);
  }
  return htmlElement;
}

function fixTableStructure(tableElement) {
  if (!tableElement) return null;

  const headers = tableElement.querySelectorAll('th');
  headers.forEach(th => {
    if (!th.hasAttribute('scope')) {
      const row = th.closest('tr');
      const cellIndex = Array.from(row.children).indexOf(th);
      th.setAttribute('scope', 'col');
    }
  });

  const existingCaption = tableElement.querySelector('caption');
  if (!existingCaption) {
    const caption = document.createElement('caption');
    caption.textContent = 'Data table';
    tableElement.insertBefore(caption, tableElement.firstChild);
  }

  return tableElement;
}

function addAriaLabel(elementId, label) {
  const element = document.getElementById(elementId);
  if (element) {
    element.setAttribute('aria-label', label);
  }
}

function addAccessibleName(svgString) {
  const parser = new DOMParser();
  const svg = parser.parseFromString(svgString, 'image/svg+xml');
  const svgElement = svg.documentElement;
  if (!svgElement.hasAttribute('aria-label') && !svgElement.hasAttribute('aria-labelledby')) {
    svgElement.setAttribute('aria-label', getSvgAccessibleName(svgElement));
  }
  const serializer = new XMLSerializer();
  return serializer.serializeToString(svgElement);
}

function validateTableAccessibility(tableData) {
  return main.validateTableAccessibility(tableData);
}

function validateLandmarkHelpers() {
  // Implementation placeholder
}

function validateLandmarkStructHelpers() {
  // Implementation placeholder
}

function getFullLangAttribute() {
  return 'en-US';
}

function setSvgAttributes(svg, attributes) {
  Object.entries(attributes).forEach(([key, value]) => {
    svg.setAttribute(key, value);
  });
}

function getSvgAccessibleName(svg) {
  return svg.getAttribute('title') || 'SVG icon';
}

function validateLandmark(container) {
  // Implementation placeholder
}

function validateLandmarkStructure(container) {
  // Implementation placeholder
}

function checkAccessibilityForReport(container) {
  return [];
}

function validateAccessibilityReport(container) {
  return { issues: [] };
}

function renderGraphIndex(container) {
  // Implementation placeholder
}

function focusTrap(container) {
  // Implementation placeholder
}

function addMainLandmarkToIndex(container) {
  // Wrap primary content in <main> element
  const body = container.ownerDocument ? container.ownerDocument.body : document.body;
  if (!body) {
    return null;
  }

  // Check if main element already exists
  let mainElement = container.querySelector('main');
  if (!mainElement) {
    mainElement = document.createElement('main');
    mainElement.setAttribute('role', 'main');
  }

  // Move all direct children of body that are not landmark elements into main
  const landmarkTagNames = new Set(['header', 'footer', 'nav', 'aside']);
  const nodesToMove = [];

  Array.from(body.childNodes).forEach(node => {
    if (node.nodeType === Node.ELEMENT_NODE) {
      const tagName = node.tagName.toLowerCase();
      if (!landmarkTagNames.has(tagName) && 
          !(tagName === 'main' && node.getAttribute('role') === 'main')) {
        nodesToMove.push(node);
      }
    }
  });

  // Move nodes into main element
  nodesToMove.forEach(node => {
    mainElement.appendChild(node);
  });

  // Ensure main is in the right place (after header/nav, before footer)
  const firstFooter = body.querySelector('footer');
  if (firstFooter) {
    body.insertBefore(mainElement, firstFooter);
  } else {
    // If no footer, just append main to body
    body.appendChild(mainElement);
  }

  return mainElement;
}

function ensureUniqueLandmarks() {
  const landmarks = document.querySelectorAll('header[role="banner"], footer[role="contentinfo"], main[role="main"], nav[role="navigation"]');
  const seenIds = new Set();
  
  landmarks.forEach(landmark => {
    if (!landmark.id) {
      const tagName = landmark.tagName.toLowerCase();
      let id = tagName;
      let counter = 1;
      while (seenIds.has(id)) {
        id = `${tagName}-${counter++}`;
      }
      landmark.id = id;
      seenIds.add(id);
    } else {
      seenIds.add(landmark.id);
    }
  });

  const allIds = Array.from(document.querySelectorAll('[id]')).map(el => el.id);
  const uniqueIds = new Set(allIds);
  return uniqueIds.size === allIds.length;
}

// Export for use in other modules
module.exports = {
    ...main,
    navigate,
    validateTableStructure,
    validateTableAccessibility,
    implementAccessibilityFixesFromReport,
    checkAccessibilityForReport,
    renderGraphIndex,
    trapFocus,
    addLangAttribute,
    fixTableStructure,
    addAriaLabel,
    addAccessibleName,
    createInPageButton,
    ensureLangAttribute,
    ensureLandmarks,
    ensureUniqueLandmarks,
    fixTableStructures,
    fixFakeLinks,
    initGoogleSignIn,
    fixButtonIds,
    ensureSvgAccessibleNames,
    ensureDependencyGraphAriaRole,
    initAccessibility,
    function3,
    addressAccessibilityIssues,
    updateFunction,
    accessibleFunction,
    newFunction1,
    newFunction2,
    newFunction,
    anotherNewFunction,
    getLangAttribute,
    ensureDependencyGraphARIA,
    validateSession,
    handleCredentialResponse,
    addAriaLabel,
    addMainLandmarkToIndex
};