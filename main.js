const main = require('./utilities')

const {
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
  checkAccessibilityForReport,
  renderGraphIndex,
  trapFocus,
  addLandmarkRegions,
  uniqueLandmarks,
  fixFakeLinkIssues,
  getActiveSessionsCount,
  validateSession,
  handleCredentialResponse,
  accessibilityUtils,
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
  initializeAccessibility,
  renderIndex,
  newFunction,
  validateHeadingHierarchy,
  ensureHeadingHierarchy,
  renderAdditionalContent
} = main

/**
 * Generates a report based on accessibility issues found during scanning
 * @param {Array} issues - Array of accessibility issues found
 * @param {Object} options - Report generation options
 * @returns {Object} Generated accessibility report
 */
function generateAccessibilityReport(issues, options = {}) {
  const {
    includeSummary = true,
    includeDetails = true,
    groupByImpact = true,
    format = 'object'
  } = options;

  if (!issues || !Array.isArray(issues)) {
    return {
      success: false,
      error: 'No issues provided for report generation',
      timestamp: new Date().toISOString()
    };
  }

  const report = {
    success: true,
    timestamp: new Date().toISOString(),
    totalIssues: issues.length,
    summary: null,
    issues: [],
    groupedByImpact: null
  };

  if (includeSummary) {
    const criticalCount = issues.filter(i => i.impact === 'critical').length;
    const seriousCount = issues.filter(i => i.impact === 'serious').length;
    const moderateCount = issues.filter(i => i.impact === 'moderate').length;
    const minorCount = issues.filter(i => i.impact === 'minor').length;

    report.summary = {
      critical: criticalCount,
      serious: seriousCount,
      moderate: moderateCount,
      minor: minorCount,
      total: issues.length,
      passRate: issues.length === 0 ? 100 : Math.max(0, ((issues.length - (criticalCount + seriousCount)) / issues.length * 100)).toFixed(2)
    };
  }

  if (includeDetails) {
    report.issues = issues.map(issue => ({
      id: issue.id || issue.ruleId,
      description: issue.description || issue.help,
      help: issue.help || issue.description,
      impact: issue.impact || 'none',
      helpUrl: issue.helpUrl || issue.link,
      nodes: issue.nodes ? issue.nodes.map(node => ({
        html: node.html,
        target: node.target,
        xpath: node.xpath,
        violations: node.violations || []
      })) : []
    }));
  }

  if (groupByImpact) {
    report.groupedByImpact = {
      critical: report.issues.filter(i => i.impact === 'critical'),
      serious: report.issues.filter(i => i.impact === 'serious'),
      moderate: report.issues.filter(i => i.impact === 'moderate'),
      minor: report.issues.filter(i => i.impact === 'minor')
    };
  }

  if (format === 'json') {
    return JSON.stringify(report, null, 2);
  }

  if (format === 'html') {
    return generateHtmlReport(report);
  }

  return report;
}

/**
 * Generates an HTML report from accessibility issues
 * @param {Object} report - The accessibility report object
 * @returns {string} HTML formatted report
 */
function generateHtmlReport(report) {
  let html = '<div class="accessibility-report">';
  html += '<h2>Accessibility Report</h2>';
  html += `<p>Generated: ${report.timestamp}</p>`;

  if (report.summary) {
    html += '<div class="summary">';
    html += '<h3>Summary</h3>';
    html += `<p>Total Issues: ${report.summary.total}</p>`;
    html += `<p>Pass Rate: ${report.summary.passRate}%</p>`;
    html += '<ul>';
    html += `<li class="critical">Critical: ${report.summary.critical}</li>`;
    html += `<li class="serious">Serious: ${report.summary.serious}</li>`;
    html += `<li class="moderate">Moderate: ${report.summary.moderate}</li>`;
    html += `<li class="minor">Minor: ${report.summary.minor}</li>`;
    html += '</ul>';
    html += '</div>';
  }

  if (report.issues && report.issues.length > 0) {
    html += '<div class="issues">';
    html += '<h3>Issues</h3>';
    report.issues.forEach(issue => {
      html += `<div class="issue ${issue.impact}">`;
      html += `<h4>${issue.description}</h4>`;
      html += `<p><strong>Impact:</strong> ${issue.impact}</p>`;
      html += `<p><strong>Help:</strong> ${issue.help}</p>`;
      if (issue.nodes && issue.nodes.length > 0) {
        html += '<div class="nodes">';
        html += '<h5>Affected Elements:</h5>';
        issue.nodes.forEach(node => {
          html += `<div class="node"><code>${node.html || node.target}</code></div>`;
        });
        html += '</div>';
      }
      html += '</div>';
    });
    html += '</div>';
  }

  html += '</div>';
  return html;
}

/**
 * Writes accessibility report to a file or console
 * @param {Object|string} report - The report to write
 * @param {Object} options - Output options
 * @returns {Promise<void>}
 */
async function writeAccessibilityReport(report, options = {}) {
  const {
    outputPath = null,
    consoleOutput = true,
    format = 'object'
  } = options;

  const formattedReport = typeof report === 'string' ? report : 
    format === 'json' ? JSON.stringify(report, null, 2) : 
    format === 'html' ? report :
    JSON.stringify(report, null, 2);

  if (consoleOutput) {
    console.log(formattedReport);
  }

  if (outputPath) {
    const fs = require('fs').promises;
    try {
      await fs.writeFile(outputPath, formattedReport, 'utf8');
    } catch (error) {
      console.error('Failed to write accessibility report:', error.message);
      throw error;
    }
  }
}

function validateHeadingHierarchy(headings) {
  // Implementation placeholder - function to be implemented
  return true
}

function ensureHeadingHierarchy(container) {
  if (!container) return null;

  const headings = container.querySelectorAll('h2, h3, h4, h5, h6');
  let previousLevel = 0;

  headings.forEach(heading => {
    const currentLevel = parseInt(heading.tagName.charAt(1), 10);
    if (previousLevel > 0 && currentLevel - previousLevel > 1) {
      // Fix skipped heading levels by promoting or demoting as needed
      const correctedLevel = previousLevel + 1;
      const newHeading = document.createElement(`h${correctedLevel}`);
      newHeading.innerHTML = heading.innerHTML;
      newHeading.className = heading.className;
      heading.parentNode.replaceChild(newHeading, heading);
      previousLevel = correctedLevel;
    } else {
      previousLevel = currentLevel;
    }
  });

  return container;
}

/**
 * New function to handle additional rendering logic
 * @param {Object} additionalData - Additional data for rendering
 * @returns {string} Rendered additional content HTML
 */
function renderAdditionalContent(additionalData) {
  // Implementation of the new function
  // Placeholder for actual implementation
  return ''
}

module.exports = {
  ...main,
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
  checkAccessibilityForReport,
  renderGraphIndex,
  trapFocus,
  addLandmarkRegions,
  uniqueLandmarks,
  fixFakeLinkIssues,
  getActiveSessionsCount,
  validateSession,
  handleCredentialResponse,
  accessibilityUtils,
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
  initializeAccessibility,
  renderIndex,
  newFunction,
  validateHeadingHierarchy,
  ensureHeadingHierarchy,
  renderAdditionalContent,
  generateAccessibilityReport,
  generateHtmlReport,
  writeAccessibilityReport
};