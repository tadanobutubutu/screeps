const express = require('express');
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

const AddressabilityIssues = {
  MISSING_ID: 'missing-id',
  MISSING_ARIA_LABEL: 'missing-aria-label',
  MISSING_ROLE: 'missing-role',

  addressAccessibilityIssues(insightReport) {
    if (!insightReport || !insightReport.sections) {
      return [];
    }

    const issues = [];

    insightReport.sections.forEach((section, index) => {
      if (!section.heading) {
        issues.push({
          type: 'missing-heading',
          severity: 'high',
          message: `Section ${index} is missing a heading`,
          suggestedFix: 'Add a descriptive heading to each section'
        });
      }

      if (!section.content || section.content.trim() === '') {
        issues.push({
          type: 'empty-content',
          severity: 'medium',
          message: `Section "${section.heading}" has no content`,
          suggestedFix: 'Add meaningful content to the section'
        });
      }

      if (section.content && section.content.toLowerCase().includes('click here')) {
        issues.push({
          type: 'inaccessible-link-text',
          severity: 'low',
          message: `Section "${section.heading}" contains "click here" text which is not accessible`,
          suggestedFix: 'Use descriptive link text instead of "click here"'
        });
      }
    });

    return issues;
  },

  calculateAccessibilityScore(fixedIssues) {
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
      return score + (scorePoints[issue.type] || scorePoints.other);
    }, 0);
  },

  validateLandmark(element) {
    if (!element) {
      return { valid: false, error: 'Element is required' };
    }

    const landmarkRoles = [
      'banner',
      'main',
      'navigation',
      'search',
      'contentinfo',
      'complementary',
      'region',
      'form'
    ];

    const tagName = element.tagName ? element.tagName.toLowerCase() : '';
    const role = element.getAttribute('role');

    const implicitLandmarks = {
      'header': 'banner',
      'main': 'main',
      'nav': 'navigation',
      'aside': 'complementary',
      'footer': 'contentinfo',
      'section': 'region',
      'form': 'form'
    };

    const isLandmark = landmarkRoles.includes(role) ||
                       (tagName && implicitLandmarks[tagName]);

    return {
      valid: isLandmark,
      tagName: tagName,
      role: role
    };
  },

  spawnSomeCommand(command) {
    const childProcess = require('child_process');
    return childProcess.spawn(command, [], {
      stdio: 'inherit',
      shell: true
    });
  },

  addLangAttribute(element, lang) {
    if (element) {
      element.setAttribute('lang', lang);
    } else {
      const html = document.documentElement;
      if (!html.hasAttribute('lang')) {
        html.setAttribute('lang', 'en');
      }
    }
  },

  countDependencies() {
    const packageJsonPath = path.join(__dirname, 'package.json');
    const packageJson = fs.readFileSync(packageJsonPath, 'utf8');

    const dependencies = JSON.parse(packageJsonPath).dependencies || {};
    const devDependencies = JSON.parse(packageJsonPath).devDependencies || {};

    return {
      dependencies: Object.keys(dependencies).length,
      devDependencies: Object.keys(devDependencies).length,
      total: Object.keys(dependencies).length + Object.keys(devDependencies).length
    };
  },

  fixMainLandmarkIssues(source) {
    const mainBlockRegex = /<main[^>]*>.*?<\/main>/gs;

    const matches = Array.from(source.matchAll(mainBlockRegex));
    if (matches.length <= 1) {
      return source;
    }

    let result = source;
    for (let i = 1; i < matches.length; i++) {
      const block = matches[i][0];
      const fixedBlock = block
        .replace(/<main>/, '<section>')
        .replace(/<\/main>/, '</section>');
      result = result.replace(block, fixedBlock);
    }

    return result;
  },

  fixSemanticMarkup(source) {
    const mainBlockRegex = /<main[^>]*>[\s\S]*?<\/main>/gi;

    const matches = source.match(mainBlockRegex);
    if (!matches || matches.length <= 1) {
      return source;
    }

    let result = source;
    for (let i = 1; i < matches.length; i++) {
      const block = matches[i][0];
      const fixedBlock = block
        .replace(/<main>/, '<section>')
        .replace(/<\/main>/, '</section>');
      result = result.replace(block, fixedBlock);
    }

    return result;
  },

  validateLandmarkStructure() {
    const landmarks = document.querySelectorAll('[role], header, nav, main, aside, footer');
    const landmarkRoles = ['banner', 'navigation', 'main', 'complementary', 'contentinfo', 'search', 'form', 'application'];

    landmarks.forEach(landmark => {
      const tagName = landmark.tagName ? landmark.tagName.toLowerCase() : '';
      const role = landmark.getAttribute('role');
      const implicitRole = {
        header: 'banner',
        nav: 'navigation',
        main: 'main',
        aside: 'complementary',
        footer: 'contentinfo'
      };

      if (!landmark.hasAttribute('role')) {
        const implicitLandmark = implicitRole[tagName];
        if (implicitLandmark) {
          landmark.setAttribute('role', implicitLandmark);
        }
      }
    });
  },

  setSvgAttributes(svg) {
    if (!svg.hasAttribute('aria-hidden')) {
      svg.setAttribute('aria-hidden', 'false');
    }
  }
};

function addressNewAccessibilityIssues() {
  const lang = getLangAttribute();

  const htmlElement = document.documentElement;
  if (htmlElement && typeof htmlElement !== 'undefined') {
    if (!htmlElement.getAttribute('lang')) {
      htmlElement.setAttribute('lang', lang);
    }
  }

  const main = document.querySelector('main');
  if (main && typeof main !== 'undefined') {
    main.setAttribute('role', 'main');
  }

  const submitBtn = document.querySelector('button[type="submit"], button[type="button"]');
  if (submitBtn && typeof submitBtn !== 'undefined') {
    submitBtn.setAttribute('aria-label', personName());
  }
}

function ensureElementHasId(element) {
  if (!element.id) {
    element.id = `generated-id-${Math.random().toString(36).substr(2, 9)}`;
  }
}

function addAriaLabel(element, label) {
  if (!element.hasAttribute('aria-label')) {
    element.setAttribute('aria-label', label);
  }
}

function setARIARoleForDependencyGraph() {
  if (typeof document === 'undefined') {
    return;
  }
  const dependencyGraph = document.getElementById('dependencyGraph');
  if (dependencyGraph) {
    dependencyGraph.setAttribute('role', 'grid');
  }
}

function handleTableStructureError(table, error) {
  console.error(`Table structure issues found in table: ${table.id || ''}. Error: ${error}`);
}

function handleLandmarkStructureError(landmark, issues) {
  if (landmark.tagName) {
    issues.push(`Invalid landmark: ${landmark.tagName}`);
  }

  if (landmark.nodeName.toLowerCase() === 'div' && !landmark.getAttribute('role')) {
    issues.push('Missing role attribute');
  }
}

function createAccessibleLink(options) {
  return {
    type: 'a',
    href: options.href,
    text: options.text,
    ariaLabel: options.ariaLabel || options.text,
    isFake: false
  };
}

function handleCredentialResponse(credentialResponse) {
  if (!credentialResponse || typeof credentialResponse !== 'object') {
    return {
      success: false,
      error: 'Invalid credential response format'
    };
  }

  if (!credentialResponse.credential || !credentialResponse.clientDataJSON) {
    return {
      success: false,
      error: 'Missing required credential fields'
    };
  }

  try {
    const clientData = JSON.parse(atob(credentialResponse.clientDataJSON.split('.')[0]));

    if (clientData.challenge !== window.currentChallenge) {
      return {
        success: false,
        error: 'Challenge verification failed'
      };
    }

    window.storedCredential = credentialResponse;

    return {
      success: true,
      credential: credentialResponse.credential,
      clientData: clientData,
      message: 'Credential successfully processed'
    };
  } catch (error) {
    return {
      success: false,
      error: 'Failed to parse credential data',
      details: error.message
    };
  }
}

function handleAccessibilityIssues(issues) {
  const handled = [];
  const unhandled = [];

  issues.forEach(issue => {
    if (issue.fixable) {
      handled.push(issue);
    } else {
      unhandled.push(issue);
    }
  });

  return {
    total: issues.length,
    handled: handled.length,
    unhandled: unhandled.length,
    unhandledIssues: unhandled
  };
}

function addressAccessibilityIssues(insightReport) {
  const accessibilityIssues = [];
  if (!insightReport || !insightReport.sections) {
    return accessibilityIssues;
  }

  insightReport.sections.forEach(section => {
    if (section.heading && section.content) {
      const heading = section.heading.trim();
      const content = section.content.trim();

      const images = content.match(/<img [^>]*>/g);
      if (images) {
        images.forEach(img => {
          const imgAlt = img.match(/alt="[^"]*"/);
          if (!imgAlt) {
            accessibilityIssues.push({
              type: 'missing-alt-text',
              status: 'pending',
              fixApplied: ''
            });
          }
        });
      }

      const interactiveElements = content.match(/<button [^>]*>|<a [^>]*>|<input [^>]*>|<select [^>]*>|<textarea [^>]*>/g);
      if (interactiveElements) {
        interactiveElements.forEach(el => {
          const ariaLabel = el.match(/aria-label="[^"]*"/);
          if (!ariaLabel) {
            accessibilityIssues.push({
              type: 'missing-aria-label',
              status: 'pending',
              fixApplied: ''
            });
          }
        });
      }
    }
  });

  return accessibilityIssues;
}

function initializeAccessibility(svgElements) {
  if (!document.querySelectorAll) return;
  
  if (typeof addressAccessibilityIssues === 'function') {
    addressAccessibilityIssues(sampleInsightReport);
  }
  
  if (svgElements && typeof svgElements === 'function') {
    svgElements();
  }
}

function checkTableStructure(table) {
  function handleInvalidTableStructure(table, error) {
    console.error(`Table structure issues found: ${error}`);
  }
  
  return table;
}

function checkLandmarkElements(response) {
  return typeof response === 'string' && response.includes('landmark');
}

function MyComponent() {
  const langAttr = typeof getLangAttribute === 'function' ? getLangAttribute() : 'en';
  const element = document.createElement('div');
  element.lang = langAttr;
  return element;
}

function generateAccessibilityReport(accessibilityReport) {
  return {
    totalIssues: 0,
    issues: []
  };
}

const appState = {
  initialized: false,
  data: null,
  cache: new Map()
};

function fixLandmarkStructure(source) {
  const mainBlockRegex = /<main[^>]*>([\s\S]*?)<\/main>/gi;
  const matches = source.match(mainBlockRegex);
  if (matches.length <= 1) {
    return source;
  }
  return source;
}

function checkLandmarkStructure(landmark) {
  const issues = [];
  const validLandmarks = ['header', 'nav', 'main', 'aside', 'footer', 'section', 'article'];

  function handleInvalidLandmarkStructure(element, issues) {
    if (element.tagName && !validLandmarks.includes(element.tagName.toLowerCase())) {
      issues.push(`Invalid landmark: ${element.tagName}`);
    }

    if (element.nodeName.toLowerCase() === 'div' && !element.getAttribute('role')) {
      issues.push('Missing role attribute');
    }
  }

  return {
    success: issues.length === 0,
    issues,
    handleInvalidLandmarkStructure
  };
}

function ensureUniqueLandmarks(source) {
  return source || '';
}

function startDependencyGraphRenders() {
  if (typeof renderDependencyGraphs === 'function') {
    renderDependencyGraphs();
  }
}

function renderDependencyGraphs() {
}

function startApp() {
  const server = createServer();
  server.on('listening', () => {
    if (typeof document !== 'undefined') {
      updateElementWithIdOrAriaLabel(document.getElementById('MyElement'), 'My Element');
    }
    newFunction();
  });
}

function newFunction() {
}

function updateElementWithIdOrAriaLabel(element, label) {
  if (element) {
    if (!element.id) {
      element.id = `generated-id-${Math.random().toString(36).substr(2, 9)}`;
    }
    if (label) {
      element.setAttribute('aria-label', label);
    }
  }
}

function ensureElementHasIdAndAddAriaLabel(element, label) {
  if (element) {
    ensureElementHasId(element);
    addAriaLabel(element, label);
  }
}

function addBook(bookData) {
  return bookData;
}

function createServer() {
  return null;
}

if (require.main === module) {
  startApp();
}

const sampleInsightReport = {
  title: 'Quarterly Performance Report',
  sections: [
    {
      heading: 'Sales Overview',
      content: 'Total sales increased by 15% compared to last quarter.'
    },
    {
      heading: 'Customer Satisfaction',
      content: 'Average satisfaction score: 4.2 out of 5.'
    }
  ]
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    config,
    addBook,
    createServer,
    startApp,
    addressAccessibilityIssues,
    generateAccessibilityReport,
    checkLandmarkElements,
    appState,
    appData,
    validateLandmark: AddressabilityIssues.validateLandmark,
    HTML,
    getLangAttribute,
    validateTableAccessibility,
    validateTableStructure,
    ensureElementHasId,
    addAriaLabel,
    addHtmlLangAttribute,
    addLandmarkRoles,
    assignLandmarkIds,
    fixFakeLink,
    validateLandmarkStructure: AddressabilityIssues.validateLandmarkStructure,
    ensureUniqueLandmarks,
    getSvgAccessibleName,
    createAccessibleLink,
    handleCredentialResponse,
    handleAccessibilityIssues,
    calculateAccessibilityScore: AddressabilityIssues.calculateAccessibilityScore,
    ensureUniqueLandmarksFromString,
    spawnSomeCommand: AddressabilityIssues.spawnSomeCommand,
    addLangAttribute: AddressabilityIssues.addLangAttribute,
    countDependencies: AddressabilityIssues.countDependencies,
    MyComponent,
    init,
    setupKeyboardNavigation,
    setupAriaLiveRegions,
    setupFocusManagement,
    enhanceSemanticMarkup,
    closeOpenDialogs,
    announceToScreenReader,
    calculateDifference,
    calculateProduct,
    isNumber,
    clamp,
    validateLinkAccessibility,
    handleFakeLinks,
    hello,
    AddressabilityIssues,
    startDependencyGraphRenders,
    renderDependencyGraphs,
    newFunction,
    updateElementWithIdOrAriaLabel,
    setARIARoleForDependencyGraph,
    ensureElementHasIdAndAddAriaLabel,
    personName,
    fixLandmarkStructure,
    myNewFunction,
    addressNewAccessibilityIssues,
    createInPageButton,
    checkTableStructure,
    checkLandmarkStructure,
    handleTableStructureError,
    handleLandmarkStructureError,
    initializeAccessibility,
    setSvgAttributes: AddressabilityIssues.setSvgAttributes
  };
} else {
  if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initializeAccessibility);
    } else {
      initializeAccessibility();
    }
  }
}