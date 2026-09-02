// main.js - Accessibility-focused implementation

const AddressabilityIssues = {
  MISSING_ID: 'missing-id',
  MISSING_ALT: 'missing-alt',
  MISSING_ARIA_LABEL: 'missing-aria-label',
  MISSING_ROLE: 'missing-role',
  LOW_CONTRAST: 'low-contrast',
  TINY_SIZE: 'tiny-size'
};

function generateUniqueId() {
  return 'svg-' + Math.random().toString(36).substr(2, 9);
}

function checkTableStructure(table) {
  if (!table) {
    return { valid: false, error: 'Table element is required' };
  }

  const hasHeader = table.querySelector('thead') || table.querySelector('th');
  const hasBody = table.querySelector('tbody') || table.querySelector('tr');
  const hasCaption = table.querySelector('caption');

  return {
    valid: hasHeader && hasBody,
    hasHeader: !!hasHeader,
    hasBody: !!hasBody,
    hasCaption: !!hasCaption
  };
}

function extractAccessibilityIssues(insightReport) {
  if (!insightReport || !insightReport.sections) {
    return [];
  }

  const issues = [];

  insightReport.sections.forEach((section, index) => {
    // Check for missing headings
    if (!section.heading) {
      issues.push({
        type: 'missing-heading',
        severity: 'high',
        message: `Section ${index} is missing a heading`,
        suggestedFix: 'Add a descriptive heading to each section'
      });
    }

    // Check for empty content
    if (!section.content || section.content.trim() === '') {
      issues.push({
        type: 'empty-content',
        severity: 'medium',
        message: `Section ${index} has no content`,
        suggestedFix: 'Add meaningful content to the section'
      });
    }

    // Check for potentially inaccessible language
    if (section.content && section.content.toLowerCase().includes('click here')) {
      issues.push({
        type: 'inaccessible-link-text',
        severity: 'low',
        message: `Section ${index} contains "click here" text which is not accessible`,
        suggestedFix: 'Use descriptive link text instead of "click here"'
      });
    }
  });

  return issues;
}

function generateAccessibilityReport(accessibilityReport) {
  if (!accessibilityReport || !accessibilityReport.issues || accessibilityReport.issues.length === 0) {
    return [];
  }

  const report = accessibilityReport.issues.map(issue => ({
    issueType: issue.type,
    status: issue.status || 'pending',
    fixApplied: issue.fixApplied || ''
  }));

  return report;
}

function calculateFixScore(fixedIssues) {
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

function transformMainToSection(source) {
  const mainBlockRegex = /<main[^>]*>([\s\S]*?)<\/main>/gi;

  const matches = source.match(mainBlockRegex);
  if (!matches || matches.length <= 1) {
    return source;
  }

  let result = source;
  for (let i = 1; i < matches.length; i++) {
    const block = matches[i];
    const fixedBlock = block
      .replace(/<main>/, '<section>')
      .replace(/<\/main>/, '</section>');
    result = result.replace(block, fixedBlock);
  }

  return result;
}

function validateLandmark(element) {
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

  const tagName = element.tagName ? element.tagName.toLowerCase() : element.tagName;

  const implicitLandmarks = {
    'header': 'banner',
    'main': 'main',
    'nav': 'navigation',
    'aside': 'complementary',
    'footer': 'contentinfo',
    'section': 'region',
    'form': 'form'
  };

  let landmarkRole = element.getAttribute ? element.getAttribute('role') : element.role;

  if (!landmarkRole && implicitLandmarks[tagName]) {
    landmarkRole = implicitLandmarks[tagName];
  }

  if (!landmarkRole) {
    return { valid: false, error: 'Element does not have a valid landmark role', element: tagName };
  }

  if (!landmarkRoles.includes(landmarkRole)) {
    return { valid: false, error: `Invalid landmark role: ${landmarkRole}`, element: tagName, role: landmarkRole };
  }

  return { valid: true, element: tagName, role: landmarkRole };
}

function runCommand(command, args, callback) {
  const child_process = require('child_process');

  const spawnOptions = { shell: true };

  child_process.execFile(command, args || [], spawnOptions, (error, stdout, stderr) => {
    if (error) {
      callback(new Error(`someCommand failed: ${error.message}`));
      return;
    }

    callback(null, `someCommand exited with status code: ${stdout}`);
  });
}

function addLangAttribute(element, lang) {
  element.setAttribute('lang', lang);
}

function countDependencies() {
  const path = require('path');
  const fs = require('fs');
  const packageJsonPath = path.join(__dirname, '..', 'package.json');
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

  const dependencies = packageJson.dependencies || {};
  const devDependencies = packageJson.devDependencies || {};

  return {
    dependencies: Object.keys(dependencies).length,
    devDependencies: Object.keys(devDependencies).length,
    total: Object.keys(dependencies).length + Object.keys(devDependencies).length
  };
}

function renderDependencyGraph() {
  const dependencyContent = '<div class="dependency-graph">Dependency visualization</div>';
  const graphContainer = document.getElementById('dependency-graph');
  if (graphContainer) {
    graphContainer.innerHTML = dependencyContent;
  }
}

function renderIndexView() {
  const indexContent = 'Index content here';
  const indexContainer = document.getElementById('index-container');
  if (indexContainer) {
    indexContainer.innerHTML = indexContent;
  }
}

function getSvgAccessibleName(svg) {
  if (!svg) return '';
  return svg.getAttribute('aria-label') || svg.getAttribute('aria-labelledby') || svg.getAttribute('title') || '';
}

function setSvgAttributes(svg) {
  if (!svg) return;

  // Handle width: set to 24 if missing or less than 24
  const width = svg.getAttribute('width');
  if (!width || parseInt(width) < 24) {
    svg.setAttribute('width', '24');
  }

  // Handle height: set to 24 if missing or less than 24
  const height = svg.getAttribute('height');
  if (!height || parseInt(height) < 24) {
    svg.setAttribute('height', '24');
  }
}

function detectAccessibilityIssues(elements) {
  const issues = [];

  elements.forEach((element, index) => {
    if (!element.id) {
      issues.push({
        element: index,
        type: AddressabilityIssues.MISSING_ID,
        message: 'Element is missing an id attribute'
      });
    }

    if (!element.getAttribute('role')) {
      issues.push({
        element: index,
        type: AddressabilityIssues.MISSING_ROLE,
        message: 'Element is missing a role attribute'
      });
    }
  });

  return issues;
}

function initializeAccessibility(container) {
  let svgElements;
  if (container instanceof Element) {
    svgElements = container.querySelectorAll ? container.querySelectorAll('svg') : [container];
  } else if (Array.isArray(container)) {
    svgElements = container;
  } else {
    svgElements = [];
  }

  svgElements.forEach(svg => {
    if (!svg.id) {
      svg.id = generateUniqueId();
    }

    if (!svg.getAttribute('role')) {
      svg.setAttribute('role', 'img');
    }

    const accessibleName = getSvgAccessibleName(svg);
    if (accessibleName) {
      svg.setAttribute('aria-label', accessibleName);
    }

    setSvgAttributes(svg);
  });

  return {
    issues: detectAccessibilityIssues(svgElements),
    count: svgElements.length
  };
}

function handleCredentialResponse(response) {
  if (!response) {
    return {
      success: false,
      message: 'No credential response provided'
    };
  }

  if (!response.token) {
    return {
      success: false,
      message: 'Token is missing from credential response'
    };
  }

  try {
    // Store credentials securely
    const credentialData = {
      token: response.token,
      refreshToken: response.refreshToken || null,
      expiresAt: response.expiresIn ? Date.now() + (response.expiresIn * 1000) : null,
      receivedAt: Date.now()
    };

    // Emit custom event for other components to handle
    if (typeof window !== 'undefined') {
      const credentialEvent = new CustomEvent('credential-received', {
        detail: credentialData,
        bubbles: true
      });
      window.dispatchEvent(credentialEvent);
    }

    return {
      success: true,
      message: 'Credential response handled successfully',
      data: credentialData
    };
  } catch (error) {
    return {
      success: false,
      message: 'Failed to process credential response: ' + error.message
    };
  }
}

function getStoredCredentials() {
  const stored = typeof localStorage !== 'undefined' ? localStorage.getItem('credentials') : null;
  if (!stored) return null;

  try {
    const credentials = JSON.parse(stored);
    if (credentials.expiresAt && Date.now() > credentials.expiresAt) {
      localStorage.removeItem('credentials');
      return null;
    }
    return credentials;
  } catch (error) {
    return null;
  }
}

function clearCredentials() {
  if (typeof localStorage !== 'undefined') {
    localStorage.removeItem('credentials');
    const clearEvent = new CustomEvent('credentials-cleared', {
      bubbles: true
    });
    window.dispatchEvent(clearEvent);
  }
}

// Export functions for testing
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    AddressabilityIssues,
    initializeAccessibility,
    getSvgAccessibleName,
    setSvgAttributes,
    checkTableStructure,
    generateUniqueId,
    detectAccessibilityIssues,
    handleCredentialResponse,
    getStoredCredentials,
    clearCredentials,
    extractAccessibilityIssues,
    generateAccessibilityReport,
    calculateFixScore,
    transformMainToSection,
    validateLandmark,
    runCommand,
    addLangAttribute,
    countDependencies,
    renderDependencyGraph,
    renderIndexView
  };
}