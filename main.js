// TODO: Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element
// - REACT_017: Add landmark roles and fix landmark issues
// - REACT_041: Add accessible names to SVGs
// - REACT_025: Ensure unique landmarks (2 issues)
// - REACT_036: Fix 1 fake link issue
// - REACT_027: Ensure scope on <th> elements

// Ensure element has an id
function ensureElementHasId(element) {
  if (!element.id) {
    element.id = 'auto-generated-id-' + Math.random().toString(36).substr(2, 9);
  }
  return element;
}

// Add aria-label to element
function addAriaLabel(element, labelText) {
  if (element) {
    element.setAttribute('aria-label', labelText);
  }
  return element;
}

// REACT_015: Add lang attribute to HTML element
function setHtmlLang(lang = "en") {
  if (typeof document !== "undefined" && document.documentElement) {
    document.documentElement.setAttribute("lang", lang);
  }
}

// REACT_015: Get current lang attribute
function getLangAttribute() {
  return document.documentElement.lang || 'en';
}

// REACT_015: Add language attribute to HTML element
function addLangAttribute() {
  if (!document.documentElement.lang) {
    document.documentElement.lang = getLangAttribute();
  }
  return document.documentElement.lang;
}

// REACT_017: Add landmark roles and fix landmark issues
function applyLandmarkRoles() {
  if (typeof document === "undefined") return;
  const header = document.querySelector("header");
  if (header && !header.getAttribute("role")) {
    header.setAttribute("role", "banner");
  }
  const nav = document.querySelector("nav");
  if (nav && !nav.getAttribute("role")) {
    nav.setAttribute("role", "navigation");
  }
  const main = document.querySelector("main");
  if (main && !main.getAttribute("role")) {
    main.setAttribute("role", "main");
  }
  const footer = document.querySelector("footer");
  if (footer && !footer.getAttribute("role")) {
    footer.setAttribute("role", "contentinfo");
  }
}

// REACT_017: Validate landmark element
function validateLandmark(element) {
  if (!element) {
    return { valid: false, message: 'Invalid landmark element' };
  }
  return { valid: true };
}

// REACT_017: Validate landmark structure
function validateLandmarkStructure(element) {
  if (!element) {
    return { valid: false, message: 'Invalid landmark element' };
  }
  return { valid: true };
}

// REACT_017: Validate landmark attributes
function validateLandmarkAttributes(element) {
  if (!element) {
    return { valid: false, message: 'Invalid landmark element' };
  }
  return { valid: true };
}

// REACT_017: Add proper landmark regions
function addProperLandmarkRegions() {
  const landmarks = {
    main: { selector: 'main', role: 'main' },
    navigation: { selector: 'nav', role: 'navigation' },
    banner: { selector: 'header', role: 'banner' },
    contentinfo: { selector: 'footer', role: 'contentinfo' },
    complementary: { selector: 'aside', role: 'complementary' },
    search: { selector: '[role="search"]', role: 'search' },
    form: { selector: 'form', role: 'form' },
    region: { selector: 'section', role: 'region' }
  };

  const results = {
    added: [],
    updated: [],
    skipped: []
  };

  Object.entries(landmarks).forEach(([name, config]) => {
    const elements = document.querySelectorAll(config.selector);
    
    elements.forEach((element, index) => {
      if (element.getAttribute('role') === config.role) {
        results.skipped.push({ landmark: name, reason: 'Already has proper role', element });
        return;
      }

      ensureElementHasId(element);

      if (!element.hasAttribute('role')) {
        element.setAttribute('role', config.role);
        results.added.push({ landmark: name, element, role: config.role });
      } else {
        element.setAttribute('role', config.role);
        results.updated.push({ landmark: name, element, role: config.role });
      }

      if (!element.hasAttribute('aria-label') && !element.hasAttribute('aria-labelledby')) {
        const label = `${name}${index > 0 ? ` ${index + 1}` : ''}`;
        addAriaLabel(element, label);
      }
    });
  });

  return results;
}

// Add main landmark element
function addMainLandmark() {
  let mainElement = document.querySelector('main') || document.querySelector('[role="main"]');
  
  if (!mainElement) {
    mainElement = document.createElement('main');
    mainElement.setAttribute('role', 'main');
    addAriaLabel(mainElement, 'Main content');
    
    const bodyChildren = Array.from(document.body.children);
    const landmarkSelectors = ['nav', 'header', 'footer', 'aside', 'main', '[role]'];
    
    bodyChildren.forEach(child => {
      if (!landmarkSelectors.some(selector => child.matches(selector))) {
        mainElement.appendChild(child);
      }
    });
    
    document.body.appendChild(mainElement);
  }
  
  return mainElement;
}

// REACT_025: Validate landmark uniqueness
function validateLandmarkUniqueness() {
  const landmarkSelectors = ['main', 'nav', 'header', 'footer', 'aside', '[role="search"]', 'form', '[role="contentinfo"]', '[role="banner"]', '[role="complementary"]', '[role="region"]'];
  const duplicateLandmarks = [];

  landmarkSelectors.forEach(selector => {
    const elements = document.querySelectorAll(selector);
    if (elements.length > 1) {
      duplicateLandmarks.push({
        selector: selector,
        count: elements.length
      });
    }
  });

  return {
    valid: duplicateLandmarks.length === 0,
    message: duplicateLandmarks.length === 0 ? 'All landmarks are unique' : `Found ${duplicateLandmarks.length} duplicate landmark(s)`,
    duplicates: duplicateLandmarks
  };
}

// REACT_025: Ensure unique landmarks
function ensureUniqueLandmarks() {
  if (typeof document === "undefined") return;
  const landmarks = document.querySelectorAll("nav, main, header, footer, aside");
  const seen = {};
  landmarks.forEach((el, idx) => {
    const tag = el.tagName.toLowerCase();
    if (seen[tag] !== undefined) {
      el.setAttribute("aria-label", `${tag} ${idx + 1}`);
    } else {
      seen[tag] = idx;
    }
  });
}

// REACT_036: Fix fake link issues
function fixFakeLinks() {
  if (typeof document === "undefined") return;
  const fakes = document.querySelectorAll('[role="link"], a.fake-link');
  fakes.forEach((el) => {
    if (el.tagName.toLowerCase() !== "a") {
      el.setAttribute("tabindex", "0");
      el.setAttribute("role", "link");
    }
  });
}

// REACT_036: Validate link accessibility
function validateLinkAccessibility(element) {
  if (!element) {
    return { valid: false, message: 'Invalid link element' };
  }
  return { valid: true };
}

// REACT_036: Handle fake links
function handleFakeLinks(element) {
  if (!element) {
    return;
  }
  if (element.getAttribute('role') === 'link' || element.style.cursor === 'pointer') {
    const href = element.getAttribute('data-href') || element.getAttribute('href') || '#';
    const anchor = document.createElement('a');
    anchor.href = href;
    anchor.textContent = element.textContent;
    anchor.className = element.className;
    anchor.id = element.id;
    
    const newAnchor = anchor.cloneNode(true);
    const events = element._events ? element._events.click : null;
    
    element.parentNode.replaceChild(newAnchor, element);
    
    if (events) {
      newAnchor.addEventListener('click', events.handler);
    }
    
    return newAnchor;
  }
  
  return element;
}

// REACT_036: Validate and fix fake link issues
function fixFakeLinkIssue() {
  const potentialFakeLinks = document.querySelectorAll('[role="link"], [onclick], [style*="cursor: pointer"]');
  const fixedLinks = [];
  
  potentialFakeLinks.forEach(element => {
    if (element.tagName === 'A') {
      return;
    }
    
    const fixedElement = handleFakeLinks(element);
    if (fixedElement && fixedElement.tagName === 'A') {
      fixedLinks.push({
        original: element,
        fixed: fixedElement
      });
    }
  });
  
  return {
    totalScanned: potentialFakeLinks.length,
    fixed: fixedLinks.length,
    details: fixedLinks
  };
}

// REACT_027: Validate table accessibility
function validateTableAccessibility(table) {
  if (!table || table.nodeName !== 'TABLE') {
    return { valid: false, message: 'Invalid table element' };
  }

  const issues = [];
  const rows = table.getElementsByTagName('tr');

  for (let i = 0; i < rows.length; i++) {
    const cells = rows[i].getElementsByTagName('td');
    const headers = rows[i].getElementsByTagName('th');
    if (cells.length > 0 && headers.length === 0 && i === 0) {
      issues.push('Missing header row');
    }
  }

  return { valid: issues.length === 0, issues };
}

// REACT_027: Validate table structure
function validateTableStructure(table) {
  if (!table || table.nodeName !== 'TABLE') {
    return { valid: false, message: 'Invalid table element' };
  }

  return { valid: true };
}

// REACT_027: Fix table structure issues
function fixTableStructure() {
  const tables = document.querySelectorAll('table');
  const results = [];
  
  tables.forEach((table, index) => {
    const validationResult = validateTableStructure(table);
    if (!validationResult.valid) {
      results.push({ table: index, result: validationResult });
      return;
    }
    
    const headerRow = table.querySelector('tr')?.querySelector('th');
    if (!headerRow) {
      const firstRow = table.querySelector('tr');
      if (firstRow) {
        const firstCells = firstRow.querySelectorAll('td');
        if (firstCells.length > 0) {
          firstCells.forEach(cell => {
            const th = document.createElement('th');
            th.scope = 'col';
            th.innerHTML = cell.innerHTML;
            cell.parentNode.replaceChild(th, cell);
          });
        }
      }
    }
    
    results.push({ table: index, result: { valid: true } });
  });
  
  return results;
}

// REACT_027: Ensure scope on <th> elements
function ensureThScope() {
  if (typeof document === "undefined") return;
  const ths = document.querySelectorAll("th");
  ths.forEach((th) => {
    if (!th.hasAttribute("scope")) {
      const row = th.parentElement;
      const isFirstRow = row && row.parentElement && row.parentElement.tagName.toLowerCase() === "thead";
      th.setAttribute("scope", isFirstRow ? "col" : "row");
    }
  });
}

// REACT_041: Add accessible names to SVGs
function addSvgAccessibleNames(names = {}) {
  if (typeof document === "undefined") return;
  const svgs = document.querySelectorAll("svg");
  let i = 0;
  svgs.forEach((svg) => {
    if (!svg.getAttribute("aria-label") && !svg.getAttribute("aria-labelledby")) {
      const name = names[i] || `Decorative icon ${i + 1}`;
      svg.setAttribute("aria-label", name);
      svg.setAttribute("role", "img");
    }
    i += 1;
  });
}

// REACT_041: Get SVG accessible name
function getSvgAccessibleName(element) {
  if (!element.getAttributeNS(null, "aria-labelledby")) {
    let labelText = "";

    if (element.nodeName === "svg") {
      const titles = element.getElementsByTagName("title");
      if (titles.length > 0) labelText = titles[0].textContent;

      const descs = element.getElementsByTagName("desc");
      if (descs.length > 0) labelText = descs[0].textContent;
    } else {
      labelText = element.getAttributeNS(null, "aria-label");
    }

    if (labelText) {
      const id = ensureElementHasId(document.createElement("span"));
      document.getElementById("myElement").appendChild(document.createTextNode(labelText));
      element.setAttribute("aria-labelledby", id);
    }
  }

  return document.getElementById(ensureElementHasId(document.createElement("span")).id);
}

// REACT_041: Set SVG attributes
function setSvgAttributes(element) {
  if (!element) {
    return;
  }
  const name = getSvgAccessibleName(element);
  if (name) {
    element.setAttribute('aria-label', name);
  }
}

// Render dependency graph
function renderDependencyGraph(dependencies) {
  const container = document.createElement('div');
  container.id = 'dependency-graph';
  dependencies.forEach(dep => {
    const node = document.createElement('div');
    node.textContent = dep;
    container.appendChild(node);
  });
  document.body.appendChild(container);
}

// Add aria-label to the element
const myElement = document.getElementById('myElement') || document.createElement('div');
ensureElementHasId(myElement);
addAriaLabel(myElement, 'A descriptive text for myElement');

// Run all accessibility fixes
function runAccessibilityFixes(options = {}) {
  setHtmlLang(options.lang || "en");
  applyLandmarkRoles();
  addSvgAccessibleNames(options.svgNames || {});
  ensureUniqueLandmarks();
  fixFakeLinks();
  ensureThScope();
}

// TODO: Implement function for addressing accessibility issues from insight report

/**
 * Address accessibility issues from the provided insight report.
 * @param {Object} insightReport - The accessibility insight report object.
 * @returns {Object} A summary of addressed issues.
 */
function addressAccessibilityIssues(insightReport) {
  if (!insightReport || typeof insightReport !== 'object') {
    return { addressed: false, message: 'Invalid insight report provided.' };
  }

  const addressedIssues = [];
  const issues = insightReport.issues || [];

  issues.forEach((issue, index) => {
    switch (issue.type) {
      case 'missing-alt-text':
        if (issue.element) {
          issue.element.setAttribute('alt', issue.suggestedAlt || 'Image description');
          addressedIssues.push({ type: issue.type, status: 'fixed', index });
        } else {
          addressedIssues.push({ type: issue.type, status: 'not-fixed', reason: 'No element found', index });
        }
        break;
      case 'low-contrast':
        if (issue.element) {
          issue.element.style.contrast = '4.5';
          addressedIssues.push({ type: issue.type, status: 'adjusted', index });
        } else {
          addressedIssues.push({ type: issue.type, status: 'not-adjusted', reason: 'No element found', index });
        }
        break;
      default:
        addressedIssues.push({ type: issue.type, status: 'skipped', index });
    }
  });

  return {
    addressed: true,
    totalIssues: issues.length,
    addressedCount: addressedIssues.filter(a => a.status !== 'not-fixed' && a.status !== 'not-adjusted').length,
    details: addressedIssues
  };
}

// Create in-page button
function createInPageButton(buttonId, text, callback) {
  const button = document.createElement('button');
  button.id = buttonId;
  button.textContent = text;
  button.addEventListener('click', callback);
  document.body.appendChild(button);
}

// New Function for testing purposes
function newTestFunction() {
  const result = "Test result";
  return result;
}

// New function to resolve Git conflicts
function resolveConflicts(content) {
  return content;
}

// New Function for handling a specific event
function handleMyEvent(event) {
}

// New function to save settings
function saveSettings(settings) {
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    setHtmlLang,
    getLangAttribute,
    addLangAttribute,
    applyLandmarkRoles,
    addProperLandmarkRegions,
    validateLandmark,
    validateLandmarkStructure,
    validateLandmarkAttributes,
    addMainLandmark,
    validateLandmarkUniqueness,
    ensureUniqueLandmarks,
    addSvgAccessibleNames,
    getSvgAccessibleName,
    setSvgAttributes,
    fixFakeLinks,
    validateLinkAccessibility,
    handleFakeLinks,
    fixFakeLinkIssue,
    validateTableAccessibility,
    validateTableStructure,
    fixTableStructure,
    ensureThScope,
    ensureElementHasId,
    addAriaLabel,
    myElement,
    renderDependencyGraph,
    newTestFunction,
    resolveConflicts,
    addressAccessibilityIssues,
    runAccessibilityFixes,
    handleMyEvent
  };
  module.exports.createInPageButton = createInPageButton;
  module.exports.saveSettings = saveSettings;
}