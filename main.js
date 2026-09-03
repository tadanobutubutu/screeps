const fs = require('fs');
const url = require('url');

const { dependencyGraphContent, indexContent } = require('./dependencyContent');
const { main } = require('./utilities');

const accessibilityUtils = {
  initSkipLink: () => {},
  trapFocus: (element) => {},
  createInPageButton,
  createWebResourceButton: (options) => {},
  validateTableAccessibility,
  validateTableStructure,
  validateLandmark,
  validateLandmarkStructure,
  getSvgAccessibleName,
  getLangAttribute,
  validateAccessibilityReport,
  announceToScreenReader,
  handleKeyboardNav,
  newFocusTrap,
  exportUtils,
  personName: () => {},
  transformInputData
};

const {
  createInPageButton,
  validateTableAccessibility,
  validateTableStructure,
  validateLandmark,
  validateLandmarkStructure,
  getSvgAccessibleName,
  getLangAttribute,
  validateAccessibilityReport,
  announceToScreenReader,
  handleKeyboardNav,
  newFocusTrap: originNewFocusTrap,
  exportUtils,
  addressAccessibilityIssues,
  handleCredentialResponse,
  ensureElementHasId: ensureElementIdOrigin,
  ensureElementId,
  renderDependencyGraphs,
  fixButtonIdentifiers,
  fixDependencyGraphAria,
  addMainLandmarkToIndex,
  focusTrap,
  newFocusTrap,
  transformInputData
} = main;

const ensureElementId = (element) => {
  if (element && !element.id) {
    element.id = "element-" + Date.now() + "-" + Math.random().toString(36).slice(2, 11);
  }
  return element;
};

const addAriaLabel = (element, label) => {
  if (element) {
    element.setAttribute('aria-label', label);
  }
  return element;
};

const renderDependencyGraph = (data) => {
  return {
    nodes: data.nodes || [],
    edges: data.edges || []
  };
};

function calculateSum(a, b) { return a + b; }

accessibilityUtils.initSkipLink = () => {
  const skipLink = document.querySelector('.skip-link');
  if (!skipLink) {
    const skipContainer = document.createElement('div');
    skipContainer.id = 'skip-link';
    skipContainer.className = 'sr-only';
    skipContainer.style.position = 'fixed';
    skipContainer.style.top = '0';
    skipContainer.style.left = '0';
    skipContainer.style.width = '100%';
    skipContainer.style.height = '100%';
    skipContainer.style.zIndex = '99999';

    const skipLinkElement = document.createElement('a');
    skipLinkElement.href = '#main-content';
    skipLinkElement.textContent = 'Skip to main content';
    skipLinkElement.ariaLabel = 'Skip to main content';
    skipContainer.appendChild(skipLinkElement);
    document.body.appendChild(skipContainer);
  }
};

accessibilityUtils.trapFocus = (element) => {
  if (!element) {
    return () => {};
  }

  const focusableElements = element.querySelectorAll(
    'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
  );

  if (focusableElements.length === 0) {
    console.warn('No focusable elements found in container');
    return;
  }

  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];

  const handleKeyDown = (e) => {
    if (e.key === 'Tab') {
      if (e.shiftKey && document.activeElement === firstElement) {
        e.preventDefault();
        lastElement.focus();
      } else if (!e.shiftKey && document.activeElement === lastElement) {
        e.preventDefault();
        firstElement.focus();
      }
    }

    if (e.key === 'Escape') {
      element.dispatchEvent(new KeyboardEvent('escape'));
    }
  };

  element.addEventListener('keydown', handleKeyDown);

  return () => {
    element.removeEventListener('keydown', handleKeyDown);
  };
};

function log(message, level = 'info') {
  const timestamp = new Date().toISOString();
  console.log(timestamp + " [" + level.toUpperCase() + "]: " + message);
}

const exportUtilities = {
  exportData: (data, filename, mimeType) => {
    const blob = new Blob([data], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.setAttribute('aria-label', "Download " + filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    announceToScreenReader("Download of " + filename + " started");
  },

  exportToJSON: (data, filename) => {
    const jsonString = JSON.stringify(data, null, 2);
    exportUtilities.exportData(jsonString, filename || 'export.json', 'application/json');
  },

  exportToCSV: (data, filename) => {
    if (!data || data.length === 0) return;

    const headers = Object.keys(data[0]);
    const csvRows = [];

    csvRows.push(headers.join(','));

    for (const row of data) {
      const values = headers.map(header => {
        const escaped = ('' + row[header]).replace(/"/g, '\\"');
        return "\"" + escaped + "\"";
      });
      csvRows.push(values.join(','));
    }

    const csvString = csvRows.join('\n');
    exportUtilities.exportData(csvString, filename || 'export.csv', 'text/csv');
  }
};

function sanitizeFilename(filename) {
  return filename.replace(/[^a-z0-9.-]/gi, '_');
}

function readFileSafe(filePath) {
  try {
    return fs.readFileSync(filePath, 'utf8');
  } catch (error) {
    log("Error reading file " + filePath + ": " + error.message, 'error');
    return null;
  }
}

function processData(items) {
  if (!Array.isArray(items)) {
    return [];
  }
  return items.map(item => ({
    ...item,
    processed: true,
    timestamp: Date.now()
  }));
}

function filterValidItems(items, validator) {
  return items.filter(item => {
    try {
      return validator(item);
    } catch {
      return false;
    }
  });
}

const initAccessibility = () => {
  accessibilityUtils.initSkipLink();

  document.querySelectorAll('button, a, input, select, textarea').forEach(element => {
    element.addEventListener('keydown', (e) => {
      const handlers = {
        Enter: () => element.click(),
        ' ': () => element.click()
      };
    });
  });
};

function groupByCategory(items, getCategory) {
  return items.reduce((groups, item) => {
    const category = getCategory(item);
    if (!groups[category]) {
      groups[category] = [];
    }
    groups[category].push(item);
    return groups;
  }, {});
}

function ensureDependencyGraphARIA() {
  const dependencyGraphElement = document.querySelector('.dependency-graph');
  if (dependencyGraphElement) {
    if (!dependencyGraphElement.getAttribute('role')) {
      dependencyGraphElement.setAttribute('role', 'region');
    }

    if (!dependencyGraphElement.getAttribute('aria-label')) {
      dependencyGraphElement.setAttribute('aria-label', 'Dependency graph visualization');
    }
  }
}

const initiateAnnounceToScreenReader = (message, priority) => {
  announceToScreenReader(message, priority);
  announcementDelayHandler();
};

const announcementDelayHandler = () => {
  setTimeout(() => {
    const announcer = document.querySelector('#sr-announcer');
    if (announcer) {
      document.body.removeChild(announcer);
    }
  }, 1000);
};

function handleKeyboardNav(e, handlers) {
  handleKeyboardNav(e, handlers);
  handleKeyboardNavKeyDownEvent(e, handlers);
}

const handleKeyboardNavKeyDownEvent = (e, handlers) => {
  if (e.key === 'Tab') {
    Object.values(handlers).forEach((handler) => {
      if (handler) {
        handler(e);
      }
    });
  }
};

function addressAccessibilityIssues(insightReport) {
  if (!insightReport || typeof insightReport !== 'object') {
    return { success: false, issuesAddressed: 0, errors: ['Invalid insight report provided'] };
  }

  const issuesAddressed = [];
  const errors = [];
  const report = insightReport;

  if (report.missingLangAttributes && report.missingLangAttributes.length > 0) {
    report.missingLangAttributes.forEach(element => {
      try {
        if (element && typeof element.setAttribute === 'function') {
          element.setAttribute('lang', 'en');
          issuesAddressed.push({ type: 'langAttribute', element: element.tagName || 'unknown' });
        }
      } catch (err) {
        errors.push({ type: 'langAttribute', error: err.message });
      }
    });
  }

  if (report.missingAltText && report.missingAltText.length > 0) {
    report.missingAltText.forEach(element => {
      try {
        if (element && typeof element.setAttribute === 'function') {
          element.setAttribute('alt', 'Image description not provided');
          issuesAddressed.push({ type: 'altText', element: element.tagName || 'unknown' });
        }
      } catch (err) {
        errors.push({ type: 'altText', error: err.message });
      }
    });
  }

  if (report.missingAriaLabels && report.missingAriaLabels.length > 0) {
    report.missingAriaLabels.forEach(element => {
      try {
        if (element && typeof element.setAttribute === 'function') {
          const label = element.getAttribute('aria-labelledby') || element.getAttribute('title') || 'Accessible label';
          element.setAttribute('aria-label', label);
          issuesAddressed.push({ type: 'ariaLabel', element: element.tagName || 'unknown' });
        }
      } catch (err) {
        errors.push({ type: 'ariaLabel', error: err.message });
      }
    });
  }

  if (report.missingHeadings && report.missingHeadings.length > 0) {
    report.missingHeadings.forEach((item, index) => {
      try {
        if (item.element && typeof item.element.setAttribute === 'function') {
          const headingLevel = item.suggestedLevel || (index + 1);
          item.element.setAttribute('role', 'heading');
          item.element.setAttribute('aria-level', headingLevel.toString());
          issuesAddressed.push({ type: 'heading', element: item.element.tagName || 'unknown', level: headingLevel });
        }
      } catch (err) {
        errors.push({ type: 'heading', error: err.message });
      }
    });
  }

  if (report.missingLandmarks && report.missingLandmarks.length > 0) {
    report.missingLandmarks.forEach(landmark => {
      try {
        if (landmark.element && typeof landmark.element.setAttribute === 'function') {
          landmark.element.setAttribute('role', landmark.type || 'region');
          issuesAddressed.push({ type: 'landmark', element: landmark.element.tagName || 'unknown', role: landmark.type });
        }
      } catch (err) {
        errors.push({ type: 'landmark', error: err.message });
      }
    });
  }

  if (report.duplicateIds && report.duplicateIds.length > 0) {
    report.duplicateIds.forEach(idGroup => {
      try {
        if (idGroup && idGroup.elements && Array.isArray(idGroup.elements)) {
          idGroup.elements.slice(1).forEach((element, idx) => {
            if (element && typeof element.setAttribute === 'function') {
              element.id = idGroup.originalId + '-duplicate-' + (idx + 1);
              issuesAddressed.push({ type: 'duplicateId', element: element.tagName || 'unknown', newId: element.id });
            }
          });
        }
      } catch (err) {
        errors.push({ type: 'duplicateId', error: err.message });
      }
    });
  }

  if (report.missingButtonNames && report.missingButtonNames.length > 0) {
    report.missingButtonNames.forEach(element => {
      try {
        if (element && typeof element.setAttribute === 'function') {
          const buttonText = element.textContent?.trim() || 'Action button';
          element.setAttribute('aria-label', buttonText);
          issuesAddressed.push({ type: 'buttonName', element: element.tagName || 'unknown' });
        }
      } catch (err) {
        errors.push({ type: 'buttonName', error: err.message });
      }
    });
  }

  if (report.emptyLinks && report.emptyLinks.length > 0) {
    report.emptyLinks.forEach(element => {
      try {
        if (element && typeof element.setAttribute === 'function') {
          const linkText = element.getAttribute('href') || 'Link';
          element.setAttribute('aria-label', linkText);
          issuesAddressed.push({ type: 'emptyLink', element: element.tagName || 'unknown' });
        }
      } catch (err) {
        errors.push({ type: 'emptyLink', error: err.message });
      }
    });
  }

  if (report.colorContrastIssues && report.colorContrastIssues.length > 0) {
    report.colorContrastIssues.forEach(issue => {
      try {
        if (issue.element && typeof issue.element.style === 'object') {
          if (issue.suggestedColor) {
            issue.element.style.color = issue.suggestedColor;
          }
          issuesAddressed.push({ type: 'colorContrast', element: issue.element.tagName || 'unknown' });
        }
      } catch (err) {
        errors.push({ type: 'colorContrast', error: err.message });
      }
    });
  }

  if (report.tables && report.tables.length > 0) {
    report.tables.forEach(table => {
      try {
        if (table.element && typeof table.element.setAttribute === 'function') {
          if (!table.element.caption && table.captionText) {
            const caption = document.createElement('caption');
            caption.textContent = table.captionText;
            table.element.insertBefore(caption, table.element.firstChild);
            issuesAddressed.push({ type: 'tableCaption', element: 'table' });
          }
        }
      } catch (err) {
        errors.push({ type: 'tableCaption', error: err.message });
      }
    });
  }

  return {
    success: errors.length === 0,
    issuesAddressed: issuesAddressed.length,
    details: issuesAddressed,
    errors: errors
  };
}

module.exports = {
  ...main,
  ...accessibilityUtils,
  ensureElementId,
  ensureElementIdOrigin,
  addAriaLabel,
  renderDependencyGraph,
  renderDependencyGraphs,
  fixButtonIdentifiers,
  fixDependencyGraphAria,
  addMainLandmarkToIndex,
  focusTrap,
  newFocusTrap,
  handleCredentialResponse,
  initAccessibility,
  groupByCategory,
  log,
  sanitizeFilename,
  readFileSafe,
  processData,
  filterValidItems,
  exportUtilities,
  calculateSum,
  ensureDependencyGraphARIA,
  ensureElementAccessibility,
  createAnnouncer,
  prefersReducedMotion,
  renderSimpleDependencyGraph,
  addAccessibleName,
  addAccessibleNamesToSVGs,
  addSvgAccessibleNames,
  fixFakeLinkIssue,
  addLangAttribute,
  fixTableStructure,
  addMainLandmark,
  fixLandmarkIssues,
  validateTableAccessibility,
  validateTableStructure,
  initializeAccessibility,
  renderIndex,
  ensureHeadingHierarchy,
  validateHeadingHierarchy,
  renderAdditionalContent,
  googleSignIn,
  decodeJwtResponse,
  ensureUniqueLandmarks,
  addSvgAccessibleName,
  calculateComplexity,
  checkLandmarkElement,
  wrapPrimaryContentInMain,
  checkLandmarks,
  a11yStore,
  anotherNewFunction,
  handleAccessibilityIssues,
  renderDependencyGraphWithAccessibility,
  initSkipLink,
  handleKeyboardNav,
  validateAndFixFormAccessibility,
  validateAndFixLinkAccessibility,
  validateAndFixButtonAccessibility,
  initiateAnnounceToScreenReader,
  handleTabNavigation: handleKeyboardNavKeyDownEvent
};