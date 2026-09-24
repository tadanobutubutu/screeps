// TODO: This is the existing code that needs to be preserved

function calculateSum(a, b) {
  return a + b;
}

/**
 * Extracts the accessible name for an SVG from its content
 * @param {SVGElement} svgElement - The SVG element to extract the name from
 * @returns {string|null} - The accessible name or null if not found
 */
function extractSvgAccessibleName(svgElement) {
  if (!svgElement || svgElement.tagName.toLowerCase() !== 'svg') {
    return null;
  }
  
  // Check for title element inside the SVG
  const titleElement = svgElement.querySelector('title');
  if (titleElement && titleElement.textContent.trim()) {
    return titleElement.textContent.trim();
  }
  
  // Check for aria-label attribute
  const ariaLabel = svgElement.getAttribute('aria-label');
  if (ariaLabel && ariaLabel.trim()) {
    return ariaLabel.trim();
  }
  
  return null;
}

/**
 * Addresses accessibility issues from an insight report by applying fixes
 * @param {Array} issues - Array of accessibility issues to address
 * @param {Object} options - Options for how to address the issues
 * @param {string} options.defaultText - Default text to add when no other text is available
 * @param {boolean} options.useAriaLabel - Prefer aria-label over visible text
 * @returns {Object} - Summary of fixes applied
 */
function addressAccessibilityIssues(issues, options = {}) {
  const defaultText = options.defaultText || 'Action';
  const useAriaLabel = options.useAriaLabel || false;
  
  const summary = {
    totalIssues: issues.length,
    linkIssuesFixed: 0,
    buttonIssuesFixed: 0,
    skipped: 0,
    fixes: []
  };

  issues.forEach((issue) => {
    if (!issue.element || !issue.element.parentNode) {
      summary.skipped++;
      return;
    }

    try {
      if (issue.type === 'link') {
        if (useAriaLabel) {
          issue.element.setAttribute('aria-label', defaultText);
        } else {
          // Add visible text content
          const textNode = document.createTextNode(defaultText);
          issue.element.appendChild(textNode);
        }
        summary.linkIssuesFixed++;
        summary.fixes.push({
          type: 'link',
          index: issue.index,
          action: 'Added accessible text content'
        });
      } else if (issue.type === 'button') {
        if (useAriaLabel) {
          issue.element.setAttribute('aria-label', defaultText);
        } else {
          // Add visible text content
          const textNode = document.createTextNode(defaultText);
          issue.element.appendChild(textNode);
        }
        summary.buttonIssuesFixed++;
        summary.fixes.push({
          type: 'button',
          index: issue.index,
          action: 'Added accessible name'
        });
      } else if (issue.type === 'svg') {
        // Extract the accessible name for an SVG from its content
        const svgContent = issue.element.innerHTML;
        const svgName = /<title>(.*?)<\/title>/gi.exec(svgContent);
        if (svgName && svgName.length > 1) {
          issue.element.setAttribute('aria-label', svgName[1]);
        } else {
          issue.element.setAttribute('aria-label', defaultText);
        }
        summary.fixes.push({
          type: 'svg',
          index: issue.index,
          action: 'Extracted accessible name'
        });
      }
    } catch (error) {
      summary.skipped++;
      summary.fixes.push({
        type: issue.type,
        index: issue.index,
        action: 'Failed to fix',
        error: error.message
      });
    }
  });

  return summary;
}

function checkLinkAndButtonAccessibility(issues, options) {
  return addressAccessibilityIssues(issues, options);
}

// New function to check for lang attribute in HTML element
function addLangAttribute(lang) {
  if (document.documentElement) {
    document.documentElement.lang = lang;
  }
}

// New function to fix table structure issues
function fixTableStructure() {
  // Example logic to fix table structure
  const tables = document.querySelectorAll('table');
  tables.forEach((table) => {
    // Example: Add `scope` attributes to header cells
    const headers = table.querySelectorAll('th');
    headers.forEach((header, index) => {
      if (!header.hasAttribute('scope')) {
        header.setAttribute('scope', index === 0 ? 'colgroup' : 'row');
      }
    });
  });
}

// New function to add/fix landmark issues
function fixLandmarkIssues() {
  // Example logic to add landmarks
  const landmarks = ['main', 'nav', 'header', 'footer', 'aside'];
  landmarks.forEach((landmark) => {
    const el = document.querySelector(landmark);
    if (el) {
      el.setAttribute('role', landmark);
    }
  });
}

// New function to ensure unique landmarks
function ensureUniqueLandmarks() {
  const landmarks = document.querySelectorAll('[role]');
  landmarks.forEach((landmark) => {
    const role = landmark.getAttribute('role');
    const sameRoleCount = Array.from(landmarks).filter(el => el.getAttribute('role') === role).length;
    if (sameRoleCount > 1) {
      console.warn(`Duplicate role '${role}' detected on multiple elements`);
    }
  });
}

// New function to add accessible names to SVGs
function addSvgAccessibleNames() {
  const svgs = document.querySelectorAll('svg');
  svgs.forEach((svg) => {
    const title = svg.querySelector('title');
    if (!title) {
      const titleElement = document.createElement('title');
      titleElement.textContent = 'SVG description';
      svg.appendChild(titleElement);
    }
  });
}

// New function to fix fake link issues
function fixFakeLinkIssue() {
  const links = document.querySelectorAll('a[href="#"]');
  links.forEach((link) => {
    link.href = '#';
    link.setAttribute('aria-label', 'Link to same page');
  });
}

// New function to implement Google sign-in logic
function googleSignIn() {
  // Google sign-in logic
}

// New function to replace my-button with actual button id for accessibility
function fixButtonIdentifiers() {
  const buttons = document.querySelectorAll('.my-button');
  buttons.forEach((button) => {
    button.id = 'unique-button-id-' + Math.random().toString(36).substr(2, 9);
  });
}

/**
 * Adds a language attribute to the HTML element
 * @param {string} lang - The language code to set on the HTML element (default: 'en')
 */
function setLanguageAttribute(lang = 'en') {
  if (typeof document !== 'undefined') {
    document.documentElement.setAttribute('lang', lang);
  }
}

/**
 * Checks accessibility of all links and buttons in the provided issues array
 * @param {Array} issues - Array of accessibility issues to address
 * @returns {Object} - Summary of fixes applied, including link and button issues
 */
function checkLinkAndButtonAccessibility(issues) {
  return addressAccessibilityIssues(issues, { useAriaLabel: true });
}

/**
 * Renders a dependency graph for debugging purposes.
 * @param {Array} modules - Array of module objects with dependencies
 * @returns {string} - A string representation of the dependency graph
 */
function renderDependencyGraph(modules) {
  const lines = [];
  lines.push('Dependency Graph:');
  modules.forEach((mod) => {
    lines.push(`  ${mod.name}`);
    if (mod.dependencies && mod.dependencies.length > 0) {
      mod.dependencies.forEach((dep) => {
        lines.push(`    -> ${dep}`);
      });
    } else {
      lines.push('    -> (no dependencies)');
    }
  });
  return lines.join('\n');
}

/**
 * Displays the structure of modules for debugging purposes.
 * @param {Array} modules - Array of module objects
 * @returns {string} - A string representation of the module structure
 */
function displayModuleStructure(modules) {
  const lines = [];
  lines.push('Module Structure:');
  modules.forEach((mod, index) => {
    lines.push(`[${index}] ${mod.name}`);
    if (mod.exports && mod.exports.length > 0) {
      mod.exports.forEach((exp) => {
        lines.push(`    exports: ${exp}`);
      });
    }
    if (mod.children && mod.children.length > 0) {
      mod.children.forEach((child) => {
        lines.push(`    child: ${child.name || child}`);
      });
    }
  });
  return lines.join('\n');
}

// Exports for the functions
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    checkLinkAndButtonAccessibility,
    addressAccessibilityIssues,
    calculateSum,
    calculateProduct,
    renderDependencyGraph,
    displayModuleStructure
  };
}

// If running in browser context
if (typeof window !== 'undefined') {
  window.checkLinkAndButtonAccessibility = checkLinkLinkAndButtonAccessibility;
  window.addressAccessibilityIssues = addressAccessibilityIssues;
  window.calculateSum = calculateSum;
  window.calculateProduct = calculateProduct;
  window.renderDependencyGraph = renderDependencyGraph;
  window.displayModuleStructure = displayModuleStructure;
}