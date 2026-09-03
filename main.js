const main = require('./utilities');

const {
  createInPageButton,
  validateTableAccessibility,
  validateTableStructure,
  validateLandmark,
  validateLandmarkStructure,
  getSvgAccessibleName,
  getLangAttribute,
  ensureElementId,
  ensureElementHasId,
  ensureElementHasIdOrigin,
  addMainLandmark,
  addLangAttribute,
  fixTableStructureIssues,
  fixFakeLinkIssue,
  fixFakeLinks,
  fixLandmarkIssues,
  addLandmarkRegions,
  uniqueLandmarks,
  fixImageAltTexts,
  ensureUniqueLandmarks,
  addSvgAccessibleNames,
  addAccessibleNamesToSVGs,
  renderDependencyGraphAria,
  addMainLandmarkToIndex,
  newFocusTrap,
  validateHeadingHierarchy,
  ensureHeadingHierarchy,
  validateAccessibilityReport,
  announceToScreenReader: originalAnnounceToScreenReader,
  handleKeyboardNav,
  exportUtils,
  transformInputData,
  addressAccessibilityIssues,
  handleCredentialResponse,
  renderDependencyGraphs,
  fixButtonIdentifiers,
  fixDependencyGraphAria,
  focusTrap,
  ensureElementIdOrigin,
  renderAdditionalContent,
  initSkipLink,
  trapFocus
} = main;

let validateAccessibilityReport = null;
let announceToScreenReader = null;
let handleKeyboardNav = null;
let handleCredentialResponse = null;

try {
  const accessibilityHelpers = require('./AccessibilityHelpers');
  validateAccessibilityReport = accessibilityHelpers.validateAccessibilityReport;
  announceToScreenReader = accessibilityHelpers.announceToScreenReader;
  handleKeyboardNav = accessibilityHelpers.handleKeyboardNav;
  handleCredentialResponse = accessibilityHelpers.handleCredentialResponse;
} catch (e) {
  // Functions not available in this module
}

try {
  const fileUtils = require('./fileUtils');
  sanitizeFilename = fileUtils.sanitizeFilename;
  readFileSafe = fileUtils.readFileSafe;
  processData = fileUtils.processData;
} catch (e) {
  // File utilities not available
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

  const issues = report.issues;

  if (!container.ownerDocument.documentElement.hasAttribute('lang')) {
    fixes.langAdded = true;
    addLangAttribute(container);
  }

  fixTableStructureIssues(container);
  fixFakeLinks(container);
  fixLandmarkIssues(container);
  uniqueLandmarks(container);

  const svgs = container.querySelectorAll('svg');
  svgs.forEach((svg) => {
    const accessibleName = getSvgAccessibleName(svg);
    if (accessibleName && !svg.getAttribute('aria-label') && !svg.querySelector('title')) {
      addAccessibleNamesToSVGs(svg, { 'aria-label': accessibleName });
      fixes.svgNamesAdded++;
    }
  });

  const buttons = container.querySelectorAll('button, a[role="button"]');
  buttons.forEach((button) => {
    if (!button.hasAttribute('id') && !button.hasAttribute('aria-label')) {
      button.setAttribute('id', `button-${fixes.fakeLinksFixed + fixes.landmarksFixed + fixes.svgNamesAdded}`);
      fixes.fakeLinksFixed++;
    }
  });

  if (validateAccessibilityReport) {
    const accessibilityReport = validateAccessibilityReport(container);
    if (accessibilityReport && accessibilityReport.issues && accessibilityReport.issues.length > 0) {
      console.log(`Accessibility report contains ${accessibilityReport.issues.length} remaining issues`);
    }
  }

  if (fixes.langAdded) {
    console.log('Lang attribute added to HTML element');
  }

  return fixes;
}

const accessibilityUtils = {
  newFocusTrap,
  exportUtils,
  validateTableAccessibility,
  addressAccessibilityIssues,
  validateHeadingHierarchy,
  validateAccessibilityReport,
  announceToScreenReader: originalAnnounceToScreenReader,
  handleKeyboardNav,
  handleCredentialResponse,
  renderDependencyGraphAria,
  addLangAttribute,
  ensureElementId,
  ensureElementHasId,
  ensureElementIdOrigin,
  ensureElementHasIdOrigin,
  addMainLandmarkToIndex,
  trapFocus,
  initSkipLink,
  fixTableStructureIssues,
  fixFakeLinkIssue,
  fixFakeLinks,
  fixLandmarkIssues,
  addLandmarkRegions,
  uniqueLandmarks,
  fixImageAltTexts,
  ensureUniqueLandmarks,
  addSvgAccessibleNames,
  addAccessibleNamesToSVGs,
  renderAdditionalContent,
  sanitizeFilename,
  readFileSafe,
  processData,
  transformInputData
};

// Utility functions for ensuring elements have IDs and adding labels
const ensureElementIdFn = (element) => {
  if (element && !element.id) {
    element.id = 'element-' + Date.now() + '-' + Math.random().toString(36).substr(2, 11);
>>>>>>> origin/main