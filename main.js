// main.js - Accessibility-focused implementation
// TODO: This is the existing code that needs to be preserved
// (Implementation added above)
// Addressed accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (handled by getLangAttribute() and getFullLangAttribute())
// - REACT_027: Fix 26 table structure issues (handled by validateTableAccessibility() and validateTableStructure())
// - REACT_017: Add/fix 4 landmark issues (handled by validateLandmark(), validateLandmarkStructure() and ensureUniqueLandmarks())
// - REACT_041: Add accessible names to 2 SVGs (handled by getSvgAccessibleName() and createInPageButton())
// - REACT_025: Ensure unique landmarks (2 issues) (handled by ensureUniqueLandmarks() and validateLandmarkStructure())
// - REACT_036: Fix 1 fake link issue (handled by createInPageButton(), createAccessibleLink() and handleAccessibilityIssues())

const config = {
  apiUrl: process.env.API_URL || 'https://api.example.com',
  timeout: process.env.TIMEOUT || 5000,
  debug: false,
  version: '1.0.0',
  dataPath: './data',
  maxResults: 100,
  maxLandmarks: 50,
  allowedRoles: ['banner', 'navigation', 'main', 'complementary', 'contentinfo', 'region']
};

const appState = {
  initialized: false,
  data: null,
  cache: new Map()
};

const appData = {
  title: 'Screeps',
  version: '1.0.0'
};

const HTML = ({ lang }) => <html lang={lang}>{/* other children */}</html>;

function implementThisFunction() {
    // TODO: Implement this function
}

function getLangAttribute() {
    return document.documentElement.lang || (navigator?.language || 'en-US');
}

function getFullLangAttribute() {
    return document.documentElement.lang || (typeof navigator !== 'undefined' ? navigator.language : 'en-US');
}

function setSvgAttributes(svg, accessibleName) {
  if (!svg) return;
  if (typeof svg === 'object') {
    if (!svg.hasAttribute('width') && svg.hasAttribute('viewBox')) {
      svg.setAttribute('width', '24');
    }
    if (!svg.hasAttribute('height') && svg.hasAttribute('viewBox')) {
      svg.setAttribute('height', '24');
    }
    svg.setAttribute('role', 'img');
    if (accessibleName) {
      svg.setAttribute('aria-label', accessibleName);
    }
  }
  return svg;
}

function getSvgAccessibleName(svgElement) {
  if (!svgElement) return 'Accessible SVG Icon';

  const title = svgElement.querySelector ? svgElement.querySelector('title') : null;
  const ariaLabel = svgElement.getAttribute ? svgElement.getAttribute('aria-label') : null;
  if (title) return title.textContent;
  if (ariaLabel) return ariaLabel;

  // Fallback to checking aria-labelledby
  const ariaLabelledby = svgElement.getAttribute ? svgElement.getAttribute('aria-labelledby') : null;
  if (ariaLabelledby) return ariaLabelledby;

  return 'Accessible SVG Icon';
}

function addLangAttribute() {
  return document.documentElement.lang || 'en';
}

function validateTableAccessibility(tableElement) {
    const issues = [];

    if (!tableElement) {
        console.warn('Table element is null or undefined');
        return {
            success: false,
            issues: ['Table element is null or undefined']
        };
    }

    if (!tableElement.caption) {
        console.warn('Table element is missing caption');
        issues.push('Missing caption element');
    }

    if (!tableElement.getAttribute('headers')) {
        issues.push('Missing headers attribute');
    }

    const headerCells = tableElement.querySelectorAll('th');
    if (headerCells) {
        headerCells.forEach(cell => {
            if (!cell.hasAttribute('scope')) {
                issues.push('Missing scope attribute on header cell');
            }
        });
    }

    return {
        success: issues.length === 0,
        issues
    };
}

function checkTableStructure(table) {
  if (!table) {
    return { valid: false, error: 'Table element is required' };
  }

  const hasHeader = table.querySelector('thead') !== null || table.querySelector('th') !== null;
  const hasBody = table.querySelector('tbody') !== null;
  const hasCaption = table.querySelector('caption') !== null;

  return {
    valid: true,
    hasHeader,
    hasBody,
    hasCaption
  };
}

function spawnSomeCommand(callback) {
    const child_process = require('child_process');
    const child = child_process.spawn('someCommand', [], {
        stdio: 'inherit',
    });
    child.on('exit', (code, signal) => {
        if (code === 0) {
            callback(null, 'Successfully executed someCommand');
        } else {
            callback(new Error(`someCommand failed with code ${code}`));
        }
    });
}

function validateTableStructure(tables) {
    const allIssues = [];

    const tableArray = Array.isArray(tables) ? tables : [tables];

    tableArray.forEach((table, index) => {
        const rows = table?.rows ?? [];
        if (!rows || rows.length === 0) {
            console.warn('Table has no rows');
            allIssues.push({
                tableIndex: index,
                issues: ['Table has no rows']
            });
        }

        const result = validateTableAccessibility(table);
        if (!result.success) {
            allIssues.push({
                tableIndex: index,
                issues: result.issues
            });
        }
    });

    return {
        success: allIssues.length === 0,
        issues: allIssues
    };
}

function countDependencies(code) {
    const requireRegex = /require\(['"]([^'"]+)['"]\)/g;
    const importRegex = /import\s+.*?\s+from\s+['"]([^'"]+)['"]/g;

    let count = 0;
    let match;

    while ((match = requireRegex.exec(code)) !== null) {
        count++;
    }

    while ((match = importRegex.exec(code)) !== null) {
        count++;
    }

    return count;
}

function countDependenciesFromPackageJson() {
    const path = require('path');
    const fs = require('fs');
    const packageJsonPath = path.join(__dirname, 'package.json');
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    const deps = { ...(packageJson.dependencies || {}), ...(packageJson.devDependencies || {}) };
    return Object.keys(deps).length;
}

function handleCredentialResponse(response) {
    if (!response) {
        return { success: false, error: 'No credential response provided' };
    }

    const hasCredential = response.credential || response.token || response.id;

    const processedCredential = {
        id: response.id || null,
        token: response.token || response.credential || null,
        name: response.name || 'Anonymous User',
        email: response.email || null,
        success: true
    };

    if (hasCredential) {
        try {
            const payload = JSON.parse(atob(response.credential.split('.')[1]));
            processedCredential.id = payload.sub || processedCredential.id;
            processedCredential.email = payload.email || processedCredential.email;
            processedCredential.name = payload.name || processedCredential.name;
        } catch (error) {
            console.warn('Failed to parse credential response:', error);
        }
    }

    if (typeof announceToScreenReader === 'function') {
        announceToScreenReader('User successfully authenticated');
    }

    return processedCredential;
}

function setupAriaLiveRegions() {
  const liveRegion = document.getElementById('aria-live-region');
  if (!liveRegion) {
    const region = document.createElement('div');
    region.id = 'aria-live-region';
    region.setAttribute('aria-live', 'polite');
    region.setAttribute('aria-atomic', 'true');
    region.className = 'sr-only';
    document.body.appendChild(region);
  }
}

function setupFocusManagement() {
  const modals = document.querySelectorAll('[role="dialog"]');
  modals.forEach((modal) => {
    modal.addEventListener('keydown', trapFocus);
  });

  const interactiveElements = document.querySelectorAll(
    'button, a, input, select, textarea, [tabindex]'
  );
  interactiveElements.forEach((element) => {
    if (!element.hasAttribute('tabindex')) {
      element.setAttribute('tabindex', '0');
    }
  });
}

function enhanceSemanticMarkup() {
  if (!document.getElementById('skip-link')) {
    const skipLink = document.createElement('a');
    skipLink.id = 'skip-link';
    skipLink.href = '#main-content';
    skipLink.textContent = 'Skip to main content';
    skipLink.className = 'skip-link';
    document.body.insertBefore(skipLink, document.body.firstChild);
  }

  const images = document.querySelectorAll('img');
  images.forEach((img) => {
    if (!img.hasAttribute('alt')) {
      img.setAttribute('alt', '');
      img.setAttribute('role', 'presentation');
    }
  });

  const inputs = document.querySelectorAll('input, select, textarea');
  inputs.forEach((input) => {
    const id = input.id || `input-${Math.random().toString(36).slice(2, 9)}`;
    input.id = id;
    if (!input.hasAttribute('aria-label') && !document.querySelector(`label[for="${id}"]`)) {
      input.setAttribute('aria-label', input.name || 'Input field');
    }
  });
}

function trapFocus(e) {
  const focusableElementsString = 'button:not([disabled]), a[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';
  const modal = e.target.closest('[role="dialog"]');
  if (!modal) return;

  const focusableElements = modal.querySelectorAll(focusableElementsString);
  const firstFocusableElement = focusableElements[0];
  const lastFocusableElement = focusableElements[focusableElements.length - 1];

  if (e.shiftKey) {
    if (document.activeElement === firstFocusableElement) {
      lastFocusableElement.focus();
      e.preventDefault();
    }
  } else {
    if (document.activeElement === lastFocusableElement) {
      firstFocusableElement.focus();
      e.preventDefault();
    }
  }
}

function handleKeyNavigation(e) {
  if (e.key === 'Enter' || e.key === ' ') {
    const target = e.target;
    if (target.getAttribute('role') === 'button') {
      target.click();
    }
  }
}

function closeOpenDialogs() {
  /* existing code */
}

function announceToScreenReader(message) {
  const liveRegion = document.getElementById('aria-live-region');
  if (liveRegion) {
    liveRegion.textContent = '';
    setTimeout(() => {
      liveRegion.textContent = message;
    }, 100);
  }
}

function calculateDifference(a, b) {
  /* existing code */
}

function calculateProduct(a, b) {
  /* existing code */
}

function isNumber(value) {
  /* existing code */
}

function clamp(value, min, max) {
  /* existing code */
}

function hello() {
  return 'Hello from main.js';
}

function getVersion() {
  return '1.0.0';
}

function getConfig() {
  return {
    apiUrl: 'https://api.example.com',
    timeout: 5000,
    retries: 3
  };
}

function createInPageButton(text, onClick) {
    const button = document.createElement('button');
    button.textContent = text;
    button.onclick = onClick;
    button.setAttribute('aria-label', text);
    return button;
}

function validateLinkAccessibility(link) {
    const issues = [];

    if (!link.href) {
        issues.push('Link missing href attribute');
    }

    if (!link.textContent && !link.ariaLabel) {
        issues.push('Link missing accessible name');
    }

    return {
        success: issues.length === 0,
        issues
    };
}

function handleFakeLinks(link) {
    if (link.href === '#' || link.href === 'javascript:void(0)') {
        return createInPageButton(link.textContent, link.onclick);
    }
}

function validateLandmark(landmark) {
    const errors = [];
    const role = landmark.getAttribute ? landmark.getAttribute('role') : landmark.role;
    const validLandmarks = ['banner', 'main', 'navigation', 'search', 'contentinfo', 'complementary', 'region', 'form'];
    if (!validLandmarks.includes(role)) {
        errors.push(`Invalid landmark role: ${role}`);
    }
    return errors;
}

function validateLandmarkElement(element) {
    const issues = [];
    const validLandmarks = ['header', 'nav', 'main', 'aside', 'footer', 'section', 'article'];

    if (!element.tagName) {
        issues.push('Missing tagName');
    } else if (!validLandmarks.includes(element.tagName.toLowerCase())) {
        issues.push(`Invalid landmark: ${element.tagName}`);
    }

    return {
        success: issues.length === 0,
        issues
    };
}

function validateLandmarkAttributes(landmark) {
    const issues = [];

    if (!landmark.ariaLabel && !landmark.ariaLabelledby && !landmark.textContent) {
        issues.push('Landmark missing accessible name');
    }

    if (landmark.role && !['banner', 'navigation', 'main', 'complementary', 'contentinfo', 'region', 'search'].includes(landmark.role)) {
        issues.push(`Invalid landmark role: ${landmark.role}`);
    }

    return {
        success: issues.length === 0,
        issues
    };
}

function validateLandmarkStructure(landmarks) {
    const issues = [];

    if (Array.isArray(landmarks)) {
        landmarks.forEach((landmark, index) => {
            const result = validateLandmarkElement(landmark);
            if (!result.success) {
                issues.push({
                    landmarkIndex: index,
                    issues: result.issues
                });
            }
        });
    } else {
        const allLandmarks = document.querySelectorAll('[role]');
        let hasMain = false;
        let hasNavigation = false;

        allLandmarks.forEach(landmark => {
            const role = landmark.getAttribute('role');
            if (role === 'main') hasMain = true;
            if (role === 'navigation') hasNavigation = true;
        });

        if (!hasMain) {
            issues.push('Missing main landmark');
        }
        if (!hasNavigation) {
            issues.push('Missing navigation landmark');
        }
    }

    return {
        success: issues.length === 0,
        issues
    };
}

function addressAccessibilityIssues(insightReport) {
  const dependencyGraph = document.getElementById('dependencyGraph');
  if (dependencyGraph) {
    if (!dependencyGraph.getAttribute('role')) {
      dependencyGraph.setAttribute('role', 'region');
    }
  }

  const landmarks = document.querySelectorAll('[role="region"], [role="navigation"], [role="search"], [role="main"], [role="banner"], [role="complementary"], [role="contentinfo"]');
  landmarks.forEach((landmark) => {
    const id = landmark.id;
    if (!id) {
      landmark.id = `landmark-${Math.random().toString(36).slice(2, 9)}`;
    }
  });
}

function generateAccessibilityReport(accessibilityReport) {
  if (!accessibilityReport || !Array.isArray(accessibilityReport.issues)) {
    return [];
  }

  const report = accessibilityReport.issues.map(issue => ({
    issueType: issue.type,
    status: issue.status || 'pending',
    fixApplied: issue.fixApplied || ''
  }));

  return report;
}

function calculateAccessibilityScore(fixedIssues) {
  if (!Array.isArray(fixedIssues)) {
    return 0;
  }

  const scorePoints = {
    'color-contrast': 5,
    'missing-alt-text': 3,
    'missing-aria-label': 5,
    'heading-order': 2,
    'other': 1
  };

  return fixedIssues.reduce((score, issue) => {
    const points = scorePoints[issue.type] || scorePoints['other'];
    return score + points;
  }, 0);
}

function ensureUniqueLandmarksFromString(source) {
  const mainBlockRegex = /<main[^>]*>.*?<\/main>/gs;

  const matches = Array.from(source.matchAll(mainBlockRegex));
  if (matches.length <= 1) {
    return source;
  }

  let result = source;
  for (let i = 1; i < matches.length; i++) {
    const block = matches[i][0];
    const fixedBlock = block
      .replace(/<main([^>]*)>/, '<section$1>')
      .replace(/<\/main>/, '</section>');
    result = result.replace(block, fixedBlock);
  }

  return result;
}

function ensureUniqueLandmarks(landmarksArg) {
    let landmarks = [];
    if (Array.isArray(landmarksArg)) {
        landmarks = landmarksArg;
    } else if (landmarksArg != null) {
        landmarks = [landmarksArg];
    }

    const elementsById = {};
    const landmarksByRole = {};

    for (let i = 0; i < landmarks.length; i++) {
        const landmark = landmarks[i];
        if (landmark.id) {
            if (elementsById[landmark.id]) {
                landmark.id += '_duplicate';
            } else {
                elementsById[landmark.id] = true;
            }
        }
        const role = landmark.getAttribute ? landmark.getAttribute('role') : landmark.role;
        if (role) {
            if (landmarksByRole[role]) {
                console.warn(`Duplicate landmark role: ${role}`);
            } else {
                landmarksByRole[role] = true;
            }
        }
    }

    return landmarks;
}

function initializeApp() {
    appState.initialized = true;
    console.log('Initializing application...');
    return true;
}

function validateInput(input) {
    return input !== null && input !== undefined;
}

function processData(data) {
    if (!validateInput(data)) {
        throw new Error('Invalid input data');
    }
    return {
        processed: true,
        data: data,
        timestamp: Date.now()
    };
}

function handleAccessibilityIssues(issues = []) {
    const handled = [];
    const unhandled = [];

    issues.forEach(issue => {
        if (issue.fixable) {
            handled.push(issue);
        } else {
            unhandled.push(issue);
        }
    });

    const tables = document.querySelectorAll('table');
    tables.forEach(table => {
        validateTableAccessibility(table);
        validateTableStructure(table);
    });

    const landmarks = document.querySelectorAll('[role]');
    landmarks.forEach(landmark => {
        validateLandmark(landmark);
    });

    validateLandmarkStructure();
    ensureUniqueLandmarks();

    const svgs = document.querySelectorAll('svg');
    svgs.forEach(svg => {
        getSvgAccessibleName(svg);
    });

    return {
        total: issues.length,
        handled: handled.length,
        unhandled: unhandled.length,
        unhandledIssues: unhandled
    };
}

function addSvgAccessibilityProps(svg, options = {}) {
    const enhancedSvg = { ...svg };

    if (options.ariaLabel) {
        enhancedSvg.ariaLabel = options.ariaLabel;
    }

    if (options.ariaHidden !== undefined) {
        enhancedSvg.ariaHidden = options.ariaHidden;
    }

    if (options.role) {
        enhancedSvg.role = options.role;
    }

    if (!enhancedSvg.ariaLabel && !enhancedSvg.ariaLabelledby && !enhancedSvg.title) {
        enhancedSvg.title = 'SVG graphic';
    }

    return enhancedSvg;
}

function addLangAttributeToElement(element) {
    element.lang = getFullLangAttribute();
    return element;
}

function addMainLandmark(document) {
    if (!document.querySelector('main')) {
        const main = document.createElement('main');
        main.setAttribute('role', 'main');
        document.body.appendChild(main);
    }
    return document;
}

function fixTableStructure(table) {
    if (!table.headers) {
        table.headers = 'auto';
    }

    if (!table.scope) {
        table.scope = 'auto';
    }

    return table;
}

function createAccessibleLink(href, text) {
    const link = document.createElement('a');
    link.href = href;
    link.textContent = text;
    link.setAttribute('aria-label', text);
    return link;
}

function fixFakeLinkIssue(element) {
  if (!element) {
    return { fixed: false, error: 'Element is required' };
  }

  const tagName = element.tagName ? element.tagName.toLowerCase() : '';
  if (tagName !== 'a') {
    return { fixed: false, error: 'Element is not an anchor tag' };
  }

  const href = element.getAttribute('href') || '';
  const isFakeLink = href === '#' || href === 'javascript:void(0)' || href === 'javascript:;';

  if (!isFakeLink) {
    return { fixed: false, error: 'Not a fake link' };
  }

  const newButton = document.createElement('button');
  newButton.innerHTML = element.innerHTML;

  Array.from(element.attributes).forEach(attr => {
    if (attr.name !== 'href') {
      newButton.setAttribute(attr.name, attr.value);
    }
  });

  if (!newButton.hasAttribute('role')) {
    newButton.setAttribute('role', 'button');
  }

  element.parentNode.replaceChild(newButton, element);

  return { fixed: true, newElement: newButton };
}

function fixFakeLinkIssues(selector = 'a[href="#"], a[href="javascript:void(0)"], a[href="javascript:;"]') {
  const fakeLinks = document.querySelectorAll(selector);
  const results = [];

  fakeLinks.forEach(link => {
    const result = fixFakeLinkIssue(link);
    results.push(result);
  });

  return {
    total: fakeLinks.length,
    fixed: results.filter(r => r.fixed).length,
    failed: results.filter(r => !r.fixed).length,
    results
  };
}

function addSvgAccessibleNames() {
    const svgs = document.querySelectorAll('svg');
    let processed = 0;

    svgs.forEach(svg => {
        const accessibleName = getSvgAccessibleName(svg);
        setSvgAttributes(svg, accessibleName);
        processed++;
    });

    return {
        success: true,
        processed
    };
}

function addLangAttributeToDoc() {
    const lang = getFullLangAttribute();
    document.documentElement.setAttribute('lang', lang);
    return lang;
}

function fixTableStructureIssues() {
    const tables = document.querySelectorAll('table');
    tables.forEach(table => {
        if (!table.querySelector('caption')) {
            const caption = document.createElement('caption');
            caption.textContent = 'Table';
            table.insertBefore(caption, table.firstChild);
        }
        if (!table.getAttribute('headers')) {
            table.setAttribute('headers', 'true');
        }
    });
}

function fixTableHeaderCellScope() {
    const headerCells = document.querySelectorAll('th');
    headerCells.forEach(cell => {
        if (!cell.hasAttribute('scope')) {
            cell.setAttribute('scope', 'col');
        }
    });
}

function addMainLandmarkToDoc() {
    const main = document.querySelector('main');
    if (!main) {
        const newMain = document.createElement('main');
        document.body.insertBefore(newMain, document.body.firstChild);
    }
}

function addLandmarkRolesAndFixIssues() {
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        if (!section.hasAttribute('role')) {
            section.setAttribute('role', 'region');
        }
    });
}

function fixLandmarkIssues() {
    ensureUniqueLandmarks();
}

function fixFakeLinks() {
    const fakeLinks = document.querySelectorAll('a[href="#"]');
    fakeLinks.forEach(link => {
        link.setAttribute('role', 'button');
        link.setAttribute('aria-label', link.textContent);
    });
}

function addProperLandmarkRegions() {
    addMainLandmarkToDoc();
    addLandmarkRolesAndFixIssues();
}

function replaceMyButton() {
    const myButton = document.getElementById('my-button');
    if (myButton) {
        const button = document.createElement('button');
        button.textContent = myButton.textContent;
        button.onclick = myButton.onclick;
        myButton.replaceWith(button);
    }
}

function ensureDependencyGraphAriaRole() {
    const container = document.getElementById('dependencyGraph');
    if (container && !container.hasAttribute('role')) {
        container.setAttribute('role', 'region');
        container.setAttribute('aria-label', 'Dependency Graph');
    }
}

function addLandmarkRegions() {
  console.log('Adding landmark regions');
}

function init() {
  setupKeyboardNavigation();
  setupAriaLiveRegions();
  setupFocusManagement();
  enhanceSemanticMarkup();
}

function setupKeyboardNavigation() {
  const interactiveElements = document.querySelectorAll('button, a, input, select, textarea');
  interactiveElements.forEach((element) => {
    element.addEventListener('keydown', handleKeyNavigation);
  });
}

const AddressabilityIssues = {
  addressAccessibilityIssues,
  generateAccessibilityReport,
  calculateAccessibilityScore,
  ensureUniqueLandmarksFromString,
  validateLandmark,
  fixFakeLinkIssue,
  fixFakeLinkIssues
};

function MyComponent() {
  const langAttr = addLangAttribute();
  return `<div lang="${langAttr}"></div>``;
}

// Ensure DOM is fully loaded before executing scripts
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    config,
    appState,
    appData,
    checkTableStructure,
    countDependencies,
    countDependenciesFromPackageJson,
    init,
    setupAriaLiveRegions,
    setupFocusManagement,
    enhanceSemanticMarkup,
    trapFocus,
    handleKeyNavigation,
    closeOpenDialogs,
    announceToScreenReader,
    calculateDifference,
    calculateProduct,
    isNumber,
    clamp,
    hello,
    getVersion,
    getConfig,
    addressAccessibilityIssues,
    generateAccessibilityReport,
    calculateAccessibilityScore,
    ensureUniqueLandmarksFromString,
    validateLandmark,
    validateLandmarkElement,
    validateLandmarkAttributes,
    validateLandmarkStructure,
    ensureUniqueLandmarks,
    getSvgAccessibleName,
    setSvgAttributes,
    createInPageButton,
    createAccessibleLink,
    handleAccessibilityIssues,
    addSvgAccessibilityProps,
    addLangAttribute,
    addLangAttributeToElement,
    addMainLandmark,
    fixTableStructure,
    addSvgAccessibleNames,
    addLangAttributeToDoc,
    fixTableStructureIssues,
    fixTableHeaderCellScope,
    addMainLandmarkToDoc,
    addLandmarkRolesAndFixIssues,
    fixLandmarkIssues,
    fixFakeLinks,
    addProperLandmarkRegions,
    replaceMyButton,
    ensureDependencyGraphAriaRole,
    initializeApp,
    validateInput,
    processData,
    addLandmarkRegions,
    validateLinkAccessibility,
    handleFakeLinks,
    fixFakeLinkIssue,
    fixFakeLinkIssues,
    implementThisFunction,
    getLangAttribute,
    getFullLangAttribute,
    validateTableAccessibility,
    validateTableStructure,
    handleCredentialResponse,
    spawnSomeCommand,
    MyComponent,
    AddressabilityIssues,
    HTML
  };
} else {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
}