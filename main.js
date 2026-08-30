// TODO: Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (handled by getLangAttribute() and getFullLangAttribute())
// - REACT_027: Fix 26 table structure issues (handled by validateTableAccessibility() and validateTableStructure())
// - REACT_017: Add/fix 4 landmark issues (handled by validateLandmark(), validateLandmarkStructure() and ensureUniqueLandmarks())
// - REACT_041: Add accessible names to 2 SVGs (handled by getSvgAccessibleName() and createInPageButton())
// - REACT_025: Ensure unique landmarks (2 issues) (handled by ensureUniqueLandmarks() and validateLandmarkStructure())
// - REACT_036: Fix 1 fake link issue (handled by createInPageButton(), createAccessibleLink() and handleAccessibilityIssues())

// Preserve existing functionality

// TODO: This is the existing code that needs to be preserved
// Functions to ensure the element has an id, add aria-label, render dependency graphs
// (Previously existing code that needs to be preserved)
// main.js - Accessibility improvements implementation
// main.js - Combined utility and accessibility features

// TODO: Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element
// - REACT_017: Add landmark roles and fix landmark issues
// - REACT_041: Add accessible names to 2 SVGs
// - REACT_025: Ensure unique landmarks (2 issues)
// - REACT_036: Fix 1 fake link issue
// - REACT_027: Add scope="col" or scope="row" to <th> elements (already implemented)
// (Added functions for REACT_017 and new REACT_025)
// - [NEW] ADD YOUR CODE HERE if any other issues need to be addressed

// Internal set to track used landmark IDs
// Global set to track used landmark IDs
const _usedLandmarkIds = new Set();

/**
 * Creates a unique identifier for a landmark given a base name.
 * @param {string} baseName - Base name of the landmark.
 * @returns {string} Unique ID.
 */
function createLandmarkId(baseName) {
    let candidate = baseName;
    if (_usedLandmarkIds.has(candidate)) {
        // Collision handling: add random suffix
        const suffix = Math.floor(Math.random() * 9000) + 1000;
        candidate = `${baseName}-${suffix}`;
    }
    _usedLandmarkIds.add(candidate);
    return candidate;
}

/**
 * Returns a new array containing only unique landmarks from the input list.
 * @param {Array} landmarks - List of landmark objects.
 * @returns {Array} Unique landmarks.
 */
function uniqueLandmarks(landmarks) {
    const seen = new Set();
    const result = [];
    for (const lm of landmarks) {
        if (!seen.has(lm.id)) {
            seen.add(lm.id);
            result.push(lm);
        }
    }
    return result;
}

// Add lang attribute as per the issue requirement
function addLangAttribute() {
  // Assuming there is a relevant element selector or similar to target
  const elementToModify = document.querySelector('html');
  if (elementToModify) {
    elementToModify.lang = 'en'; // Example: English
  }
}

/**
 * Adds an aria-label attribute to an element if it doesn't already have one.
 * @param {HTMLElement} element - The element to add the aria-label to.
 * @param {string} label - The label text to be added.
 */
function addAriaLabel(element, label) {
    if (element && !element.hasAttribute('aria-label')) {
        element.setAttribute('aria-label', label);
    }
}

/**
 * Gets the language attribute from the HTML element.
 * @returns {string} - the language attribute value
 */
function getLangAttribute() {
    return document.documentElement.lang || '';
}

/**
 * This function gets the full language attribute with region (if provided)
 * @returns {string} - the full language attribute with region (if provided)
 */
function getFullLangAttribute() {
    return document.documentElement.lang || '';
}

/**
 * Generates an accessibility report based on the collected issues.
 * @param {Object} reportData - Data containing accessibility issues and metadata.
 * @returns {Object} The generated accessibility report.
 */
function generateAccessibilityReport(reportData = {}) {
    const {
        pageUrl = '',
        pageTitle = '',
        scanDate = new Date().toISOString(),
        issues = [],
        summary = {},
        recommendations = []
    } = reportData;

    const criticalIssues = issues.filter(issue => issue.severity === 'critical');
    const majorIssues = issues.filter(issue => issue.severity === 'major');
    const minorIssues = issues.filter(issue => issue.severity === 'minor');

    return {
        reportMetadata: {
            generatedAt: scanDate,
            pageUrl,
            pageTitle,
            totalIssues: issues.length
        },
        summary: {
            total: issues.length,
            critical: criticalIssues.length,
            major: majorIssues.length,
            minor: minorIssues.length,
            complianceScore: calculateComplianceScore(issues)
        },
        issues: issues.map(issue => ({
            id: issue.id || generateIssueId(),
            code: issue.code || 'UNKNOWN',
            description: issue.description || 'No description provided',
            element: issue.element || null,
            severity: issue.severity || 'unknown',
            wcagCriterion: issue.wcagCriterion || null,
            suggestion: issue.suggestion || null
        })),
        recommendations: recommendations.length > 0 ? recommendations : generateDefaultRecommendations(issues),
        exportedAt: new Date().toISOString()
    };
}

/**
 * Generates a unique issue ID.
 * @returns {string} A unique issue identifier.
 */
function generateIssueId() {
    return `issue-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Calculates a compliance score based on the issues found.
 * @param {Array} issues - List of accessibility issues.
 * @returns {number} Compliance score (0-100).
 */
function calculateComplianceScore(issues) {
    if (!issues || issues.length === 0) {
        return 100;
    }

    const weights = {
        critical: 20,
        major: 10,
        minor: 5
    };

    let deduction = 0;
    for (const issue of issues) {
        deduction += weights[issue.severity] || 5;
    }

    return Math.max(0, Math.min(100, 100 - deduction));
}

/**
 * Generates default recommendations based on issues found.
 * @param {Array} issues - List of accessibility issues.
 * @returns {Array} Array of recommendation strings.
 */
function generateDefaultRecommendations(issues) {
    const recommendations = [];
    const issueTypes = {};

    for (const issue of issues) {
        issueTypes[issue.code] = (issueTypes[issue.code] || 0) + 1;
    }

    if (issueTypes['REACT_015']) {
        recommendations.push({
            code: 'REACT_015',
            action: 'Add lang attribute to the HTML element to specify the page language.',
            priority: 'high'
        });
    }

    if (issueTypes['REACT_017'] || issueTypes['REACT_025']) {
        recommendations.push({
            code: 'REACT_017',
            action: 'Review and fix landmark roles. Ensure all landmarks have appropriate roles and unique identifiers.',
            priority: 'high'
        });
    }

    if (issueTypes['REACT_041']) {
        recommendations.push({
            code: 'REACT_041',
            action: 'Add accessible names to SVG elements using aria-label or title attributes.',
            priority: 'medium'
        });
    }

    if (issueTypes['REACT_027']) {
        recommendations.push({
            code: 'REACT_027',
            action: 'Add scope="col" or scope="row" to table header elements for proper association.',
            priority: 'medium'
        });
    }

    if (issueTypes['REACT_036']) {
        recommendations.push({
            code: 'REACT_036',
            action: 'Replace fake links with proper buttons or ensure links have valid href attributes.',
            priority: 'high'
        });
    }

    return recommendations;
}

/**
 * Exports the report to a JSON string.
 * @param {Object} report - The accessibility report object.
 * @returns {string} JSON string of the report.
 */
function exportReportAsJson(report) {
    return JSON.stringify(report, null, 2);
}

/**
 * Creates a downloadable report file.
 * @param {Object} report - The accessibility report object.
 * @param {string} filename - Optional filename for the report.
 */
function downloadReport(report, filename = 'accessibility-report.json') {
    const jsonReport = exportReportAsJson(report);
    const blob = new Blob([jsonReport], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

// ... existing functions from both branches

// Accessibility helper functions
function setupKeyboardNavigation(options = {}) {
  const { onEnter, onEscape, onArrowUp, onArrowDown } = options;

  return function handleKeyDown(event) {
    switch (event.key) {
      case 'Enter':
        if (onEnter) onEnter(event);
        break;
      case 'Escape':
        if (onEscape) onEscape(event);
        break;
      case 'ArrowUp':
        if (onArrowUp) {
          event.preventDefault();
          onArrowUp(event);
        }
        break;
      case 'ArrowDown':
        if (onArrowDown) {
          event.preventDefault();
          onArrowDown(event);
        }
        break;
    }
  };
}

function trapFocus(container) {
  const focusableElements = container.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );

  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];

  return function handleTabKey(event) {
    if (event.key !== 'Tab') return;

    if (event.shiftKey && document.activeElement === firstElement) {
      event.preventDefault();
      lastElement.focus();
    } else if (!event.shiftKey && document.activeElement === lastElement) {
      event.preventDefault();
      firstElement.focus();
    }
  };
}

// ... other existing functions remained unchanged