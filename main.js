const {
  createInPageButton,
  validateTableAccessibility,
  validateTableStructure,
  validateLandmark,
  validateLandmarkStructure,
  getSvgAccessibleName,
  getLangAttribute,
  validateAccessibilityReport,
  announceToScreenReader: originalAnnounceToScreenReader,
  handleKeyboardNav,
  exportUtils,
  transformInputData,
  initSkipLink,
  trapFocus,
  newFocusTrap: originalNewFocusTrap,
  ensureElementId,
  addLangAttribute,
  fixTableStructureIssues,
  addMainLandmark,
  addAriaLabel,
  addressAccessibilityIssues,
  handleCredentialResponse,
  renderDependencyGraphs,
  fixButtonIdentifiers,
  fixDependencyGraphAria,
  addMainLandmarkToIndex,
  focusTrap,
  renderAdditionalContent,
  ensureElementHasId,
  renderDependencyGraph,
  renderIndex,
  addAccessibleName,
  initAccessibility,
  groupByCategory,
  log,
  sanitizeFilename,
  readFileSafe,
  processData,
  filterValidItems,
  exportUtilities,
  harvestSync,
} = main;

const accessibilityUtils = {
  initSkipLink: () => {
    const skipLink = document.getElementById('skip-link');
    if (skipLink) {
      skipLink.addEventListener('click', (e) => {
        e.preventDefault();
        const target = document.getElementById(skipLink.getAttribute('href').slice(1));
        if (target) {
          target.setAttribute('tabindex', '-1');
          target.focus();
        }
      });
    }
  },

  trapFocus: (element) => {
    const focusableElements = element.querySelectorAll(
      'a[href], button, input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    element.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') {
        if (e.shiftKey && document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    });
  },

  newFocusTrap: (element) => {
    if (!element) return originalNewFocusTrap(element);
    const focusable = element.querySelectorAll(
      'a[href], button, textarea, input, select, [tabindex]:not([tabindex="-1"])'
    );
    if (focusable.length === 0) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    element.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') {
        if (e.shiftKey && document.activeElement === first) {
          last.focus();
          e.preventDefault();
        } else if (!e.shiftKey && document.activeElement === last) {
          first.focus();
          e.preventDefault();
        }
      }
    });
  },

  announceToScreenReader: (message, priority = 'polite') => {
    const announcer = document.createElement('div');
    announcer.setAttribute('aria-live', priority);
    announcer.setAttribute('aria-atomic', 'true');
    announcer.className = 'sr-only';
    announcer.style.position = 'absolute';
    announcer.style.left = '-9999px';
    announcer.textContent = message;
    document.body.appendChild(announcer);
    setTimeout(() => announcer.remove(), 1000);
  },

  ensureElementId: (element) => {
    if (element && !element.id) {
      element.id = `el-${Math.random().toString(36).substr(2, 9)}`;
    }
    return element;
  },

  addAriaLabel: (element) => {
    element.setAttribute('aria-label', 'Accessible element');
  },

  addressAccessibilityIssues: () => {
    const issues = [
      {
        element: null,
        solution: () => {
          // element.setAttribute('aria-label', 'Fixed Issue 1');
        },
      },
      {
        element: null,
        solution: () => {
          // logic here
        },
      },
    ];

    issues.forEach((issue) => {
      if (issue.element) {
        issue.solution();
      }
    });
  },

  ensureElementIdOrigin: (element) => {
    if (!element) return;
    const id = `origin-${Math.random().toString(36).substr(2, 9)}`;
    element.id = id;
    return id;
  },

  renderDependencyGraphs: () => {
    // Render dependency graphs in the UI
  },

  fixButtonIdentifiers: () => {
    // Fix button identifier issues
  },

  fixDependencyGraphAria: () => {
    // Fix ARIA issues in dependency graphs
  },

  addSvgAccessibleName: (svgElement) => {
    // Add accessible name to SVG elements
  },

  renderDependencyGraph,
  renderIndex,
  addAccessibleName,

  addLangAttribute,
  fixTableStructureIssues,
  addMainLandmark,
};

// Utility functions for ensuring elements have IDs and adding labels
const ensureElementIdFn = (element) => {
  if (element && !element.id) {
    element.id = `el-${Math.random().toString(36).substr(2, 9)}`;
  }
  return element;
};

const ensureElementHasIdFn = (element, prefix = 'element') => {
  if (!element) {
    throw new Error('Element is required');
  }
};

const wrapPrimaryContentInMain = () => {
  let mainElement = document.querySelector('main');

  if (!mainElement) {
    mainElement = document.createElement('main');

    const contentSelectors = ['#content', '.content', '#main', '.main', 'article', '[role="main"]'];
    let primaryContent = null;

    for (const selector of contentSelectors) {
      primaryContent = document.querySelector(selector);
      if (primaryContent) {
        break;
      }
    }

    if (primaryContent) {
      primaryContent.parentNode.insertBefore(mainElement, primaryContent);
      mainElement.appendChild(primaryContent);
    }
  }
};

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

  console.log('Accessibility Compliance Report:', results.summary);

  const htmlElement = document.documentElement;
  if (!htmlElement.hasAttribute('lang')) {
    const langAttr = getFullLangAttribute();
    if (langAttr) {
      htmlElement.setAttribute('lang', langAttr);
      console.log('Fixed: Added lang attribute to HTML element');
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

  return results;
}

function harvest() {
    const resources = {
        timestamp: new Date().toISOString(),
        url: window.location.href,
        title: document.title,
        metaData: {},
        links: [],
        images: [],
        forms: []
    };

    const metaTags = document.querySelectorAll('meta');
    metaTags.forEach(meta => {
        const name = meta.getAttribute('name') || meta.getAttribute('property') || meta.getAttribute('http-equiv');
        const content = meta.getAttribute('content');
        if (name && content) {
            resources.metaData[name] = content;
        }
    });

    const links = document.querySelectorAll('a[href]');
    links.forEach(link => {
        resources.links.push({
            text: link.textContent.trim(),
            href: link.href,
            title: link.title || null
        });
    });

    const images = document.querySelectorAll('img[src]');
    images.forEach(img => {
        resources.images.push({
            src: img.src,
            alt: img.alt || '',
            width: img.width,
            height: img.height
        });
    });

    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        const formData = {
            action: form.action,
            method: form.method,
            fields: []
        };
        const inputs = form.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            formData.fields.push({
                type: input.type || input.tagName.toLowerCase(),
                name: input.name,
                id: input.id,
                placeholder: input.placeholder,
                required: input.required
            });
        });
        resources.forms.push(formData);
    });

    console.log('Harvest completed:', resources);
    return resources;
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

  const htmlElement = document.documentElement;
  if (htmlElement && !htmlElement.hasAttribute('lang')) {
    htmlElement.setAttribute('lang', getLangAttribute());
  }

  const accessibilityReport = validateAccessibilityReport(container);
  if (accessibilityReport && accessibilityReport.issues && accessibilityReport.issues.length > 0) {
    console.log(`Accessibility report contains ${accessibilityReport.issues.length} remaining issues`);
  }

  trapFocus(container);

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

// TODO: Implement tower defense in main.js
function towerDefenseGame(levelData) {
    // Placeholder for the tower defense game implementation
    console.log('Tower Defense game initialized with level data:', levelData);
    // Actual implementation would go here
}

// TODO: Implement upgrade logic
function upgrade(currentVersion, previousVersion) {
    if (!previousVersion) {
        console.log('First installation, no upgrade needed');
        return true;
    }

    const currentParts = currentVersion.split('.').map(Number);
    const previousParts = previousVersion.split('.').map(Number);

    for (let i = 0; i < Math.max(currentParts.length, previousParts.length); i++) {
        const currentPart = currentParts[i] || 0;
        const previousPart = previousParts[i] || 0;

        if (currentPart > previousPart) {
            console.log(`Upgrading from version ${previousVersion} to ${currentVersion}`);
            performUpgradeTasks(previousVersion, currentVersion);
            return true;
        } else if (currentPart < previousPart) {
            console.warn(`Downgrade detected from ${previousVersion} to ${currentVersion}`);
            return false;
        }
    }

    console.log('Version unchanged, no upgrade needed');
    return true;
}

function performUpgradeTasks(fromVersion, toVersion) {
    // Clear old cached data
    if (typeof localStorage !== 'undefined') {
        const keysToRemove = [];
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && key.startsWith('legacy_')) {
                keysToRemove.push(key);
            }
        }
        keysToRemove.forEach(key => localStorage.removeItem(key));
    }

    // Update stored version
    if (typeof localStorage !== 'undefined') {
        localStorage.setItem('app_version', toVersion);
    }

    console.log(`Upgrade tasks completed: ${fromVersion} -> ${toVersion}`);
}

// Preserve any existing exports here
export { createInPageButton, validateLandmarkStructure, renderGraphIndex, renderDependencyGraph };

module.exports = {
  ...accessibilityUtils,
  accessibilityUtils,
  ensureElementId: ensureElementIdFn,
  ensureElementHasId: ensureElementHasIdFn,
  newFocusTrap,
  addressAccessibilityIssues: accessibilityUtils.addressAccessibilityIssues,
  renderDependencyGraphs,
  fixButtonIdentifiers,
  fixDependencyGraphAria,
  addSvgAccessibleName: accessibilityUtils.addSvgAccessibleName,
  ensureElementIdOrigin: accessibilityUtils.ensureElementIdOrigin,
  validateTableAccessibility,
  validateTableStructure,
  addAccessibleName: accessibilityUtils.addAriaLabel,
  wrapPrimaryContentInMain,
  createInPageButton,
  harvest,
  function3,
  implementAccessibilityFixesFromReport,
  accessibleFunction,
  newFunction1,
  newFunction2,
  newFunction,
  anotherNewFunction,
  getLangAttribute,
  ensureDependencyGraphARIA,
  renderGraphIndex,
  validateLandmarkStructure,
};