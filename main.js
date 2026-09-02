const main = require('./utilities')

const {
  fixTableStructure,
  fixLandmarkIssues,
  addMainLandmark,
  addLandmarkRegions,
  ensureUniqueLandmarks,
  addSvgAccessibleName,
  addAccessibleNamesToSVGs,
  fixFakeLinkIssue,
  fixFakeLinkIssues,
  googleSignIn,
  decodeJwtResponse,
  fixButtonIdentifiers,
  ensureElementHasId,
  ensureElementHasIdOrigin,
  addAriaLabel,
  renderDependencyGraphs,
  fixDependencyGraphAria,
  addMainLandmarkToIndex,
  focusTrap,
  checkAccessibility,
  addressAccessibilityIssues,
  implementAccessibilityFixesFromReport,
  validateAccessibilityReport,
  createInPageButton,
  createWebResourceButton,
  validateLandmark,
  validateLandmarkStructure,
  getSvgAccessibleName,
  uniqueLandmarks,
  addSvgAccessibleNames,
  validateAccessibilityReport as validateAccessibilityReport2,
  exportUtils,
  addressAccessibilityIssues as addressAccessibilityIssues2
} = require('./AccessibilityHelpers')

const calculateDiscount = (price, discount, isPercentage = true) => {
  if (typeof price !== 'number' || price < 0) {
    return { discountAmount: 0, finalPrice: 0 };
  }

  if (typeof discount !== 'number' || discount < 0) {
    return { discountAmount: 0, finalPrice: price };
  }

  let discountAmount;
  let finalPrice;

  if (isPercentage) {
    const effectiveDiscount = Math.min(discount, 100);
    discountAmount = price * (effectiveDiscount / 100);
    finalPrice = price - discountAmount;
  } else {
    discountAmount = Math.min(discount, price);
    finalPrice = price - discountAmount;
  }

  return { discountAmount, finalPrice };
};

function setHtmlLangAttribute(lang) {
  if (typeof document !== 'undefined' && document.documentElement) {
    document.documentElement.lang = lang || 'en';
  }
  return lang || 'en';
}

function detectAndSetLang(content) {
  let lang = 'en';
  if (content) {
    if (content.match(/\p{Han}|\p{Hiragana}|\p{Katakana}|\p{Cyrillic}|\w{2,}:\n.*?\s*\|/)) {
      lang = 'zh'; // Chinese
    } else if (content.match(/(?:\p{Hiragana}|\p{Katakana}|\w+[・‐])+$/)) {
      lang = 'ja'; // Japanese
    } else if (content.match(/[А-Яа-я]+\s+\d+\s+[я-яА-Я]/)) {
      lang = 'ru'; // Russian/Cyrillic
    } else if (content.match(/^\w+\s+ال\w+$/)) {
      lang = 'ar'; // Arabic
    } else if (content.match(/^.*<\/html>$/i)) { // Check for existent lang attribute
      lang = getLangAttribute();
    } else {
      lang = 'en';
    }
  }
  return lang;
}

function getLangAttribute() {
  return (typeof document !== 'undefined' && document.documentElement) ? document.documentElement.lang : 'en';
}

function initSkipLink() {
  const skipLink = document.querySelector('.skip-link');
  if (skipLink) {
    skipLink.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = skipLink.getAttribute('href').substring(1);
      const target = document.getElementById(targetId);
      if (target) {
        target.setAttribute('tabindex', '-1');
        target.focus();
        target.scrollIntoView();
      }
    });
  }
}

function affectedFunction() {
  return main.affectedFunction();
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

function ensureDependencyGraphARIA() {
  const elements = [];
  elements.forEach(el => {
    el.setAttribute('role', 'graph');
    el.setAttribute('aria-label', 'Dependency graph visualization');
  });
}

function newFunction() {
  // New function implementation
}

function anotherNewFunction() {
  // Another new function implementation
}

function addAccessibleName(svgString) {
  const parser = new DOMParser();
  const svg = parser.parseFromString(svgString, 'image/svg+xml');
  const svgElement = svg.documentElement;
  if (!svgElement.hasAttribute('aria-label') && !svgElement.hasAttribute('aria-labelledby')) {
    svgElement.setAttribute('aria-label', getSvgAccessibleName(svgElement));
  }
  const serializer = new XMLSerializer();
  return serializer.serializeToString(svg);
}

const originalSvgString = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><title>Screeps Dashboard</title><text y="0.9em" ...';
const modifiedSvgString = addAccessibleName(originalSvgString);

function validateTableAccessibility(tableData) {
  return main.validateTableAccessibility(tableData);
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
    container.querySelectorAll('html')[0] ||
    (container.ownerDocument && container.ownerDocument.querySelectorAll('html')[0]);
  
  if (htmlEl && !htmlEl.hasAttribute('lang')) {
    htmlEl.setAttribute('lang', 'en');
    fixes.langAdded = true;
  }

  const mainElement = container.querySelectorAll('main')[0];
  if (!mainElement) {
    const body = container.ownerDocument ? container.ownerDocument.body : document.body;
    if (body) {
      const newMain = document.createElement('main');
      while (body.firstChild) {
        newMain.appendChild(body.firstChild);
      }
      body.parentNode.insertBefore(newMain, body);
      fixes.mainLandmarkAdded = true;
    }
  }

  fixLandmarkIssues(container);
  addMainLandmark(container);
  addLandmarkRegions(container);
  ensureUniqueLandmarks(container);
  fixes.landmarksFixed++;

  addSvgAccessibleNames(container);
  fixes.svgNamesAdded += container.querySelectorAll('svg[aria-label]').length;

  fixFakeLinkIssues(container);
  fixes.fakeLinksFixed += container.querySelectorAll('a[href^="#"]').length;

  const accessibilityReport = validateAccessibilityReport(container);
  if (accessibilityReport && accessibilityReport.issues && accessibilityReport.issues.length > 0) {
    log(`Accessibility report contains ${accessibilityReport.issues.length} remaining issues`, 'warn');
  }

  focusTrap(container);

  if (fixes.langAdded) {
    log('Lang attribute added to HTML element', 'info');
  }

  if (fixes.mainLandmarkAdded) {
    log('Main landmark added', 'info');
  }

  const newAccessibilityIssues = checkAccessibility(container);
  if (newAccessibilityIssues && newAccessibilityIssues.length > 0) {
    log(`New accessibility issues found: ${newAccessibilityIssues.join(', ')}`, 'error');
  }

  const landmarkFixesCount = fixes.landmarksFixed || 0;
  if (landmarkFixesCount > 0) {
    log(`Fixed ${landmarkFixesCount} unique landmarks`, 'info');
  }

  const svgFixes = fixes.svgNamesAdded || 0;
  if (svgFixes > 0) {
    log(`Fixed accessible names for ${svgFixes} SVGs`, 'info');
  }

  const fakeLinkFixes = fixes.fakeLinksFixed || 0;
  if (fakeLinkFixes > 0) {
    log(`Fixed fake link issues for ${fakeLinkFixes} elements`, 'info');
  }

  return fixes;
}

const accessibilityUtils = {
  initSkipLink,
  trapFocus,
  ensureElementHasId,
  handleKeyDown
};

function trapFocus(container) {
  return focusTrap(container);
}

function validateTableStructure(tableData) {
  return main.validateTableStructure(tableData);
}

function renderAdditionalContentData(additionalData) {
  return '';
}

function checkAccessibilityForReportContent(content) {
  return [];
}

function log(message, level = 'info') {
  if (typeof console[level] === 'function') {
    console[level](`[main.js] ${message}`);
  } else {
    console.log(`[main.js] [${level}] ${message}`);
  }
}

function validateSession() {
  return main.validateSession();
}

function handleCredentialResponse(response) {
  console.log('Credential Response:', response);
}

function renderAdditionalContent(additionalData) {
  return main.renderAdditionalContent(additionalData);
}

function checkAccessibilityForReport(content) {
  return main.checkAccessibilityForReport(content);
}

function renderGraphIndex(content, options = {}) {
  return main.renderGraphIndex(content, options);
}

export {
  validateTableAccessibility,
  validateTableStructure,
  renderAdditionalContent,
  implementAccessibilityFixesFromReport,
  checkAccessibilityForReport,
  renderGraphIndex,
  trapFocus,
  addLangAttribute: setHtmlLangAttribute,
  fixTableStructure,
  createInPageButton,
  createWebResourceButton,
  validateLandmark,
  validateLandmarkStructure,
  getSvgAccessibleName,
  getLangAttribute,
  validateAccessibilityReport,
  exportUtils,
  addressAccessibilityIssues,
  ensureElementHasId,
  ensureElementHasIdOrigin,
  addAriaLabel,
  renderDependencyGraphs,
  fixButtonIdentifiers,
  fixDependencyGraphAria,
  addMainLandmarkToIndex,
  focusTrap,
  checkAccessibility,
  affectedFunction,
  updateFunction,
  accessibleFunction,
  newFunction1,
  newFunction2,
  main,
  newFunction,
  anotherNewFunction,
  ensureDependencyGraphARIA,
  addAccessibleName,
  fixLandmarkIssues,
  addMainLandmark,
  addLandmarkRegions,
  ensureUniqueLandmarks,
  addSvgAccessibleName,
  fixFakeLinkIssue,
  fixFakeLinkIssues,
  googleSignIn,
  decodeJwtResponse,
  uniqueLandmarks,
  addSvgAccessibleNames,
  validateSession,
  handleCredentialResponse,
  renderAdditionalContentData,
  checkAccessibilityForReportContent,
  log,
  accessibilityUtils
};