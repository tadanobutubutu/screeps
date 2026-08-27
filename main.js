// REACT_017: React Landmarks validation
// Validates that pages have proper <main> landmark for accessibility

// Main module for the application
// Contains core functionality and accessibility issue resolution

/**
 * Check if HTML content has a <main> landmark
 * @param {string} htmlContent - The HTML content to validate
 * @returns {boolean} - True if <main> landmark exists
 */
function hasMainLandmark(htmlContent) {
    if (!htmlContent || typeof htmlContent !== 'string') {
        return false;
    }
    
    // Match <main> tag (with possible attributes) and its closing tag
    const mainTagRegex = /<main[\s\S]*?>[\s\S]*?<\/main>/i;
    const selfClosingRegex = /<main[\s\S]*?\/>/i;
    
    return mainTagRegex.test(htmlContent) || selfClosingRegex.test(htmlContent);
}

/**
 * Validate React landmark accessibility
 * @param {string} htmlContent - The HTML content to validate
 * @returns {object} - Validation result with details
 */
function validateReactLandmarks(htmlContent) {
    const hasMain = hasMainLandmark(htmlContent);
    
    return {
        valid: hasMain,
        rule: 'REACT_017',
        message: hasMain 
            ? 'Page has proper <main> landmark' 
            : 'Page has no <main> landmark',
        severity: 'warning',
        suggestion: hasMain 
            ? null 
            : 'Wrap the primary content in <main> so it can be skipped to'
    };
}

/**
 * Check multiple files for landmark issues
 * @param {array} files - Array of objects with 'path' and 'content' properties
 * @returns {array} - Array of validation results
 */
function validateMultipleFiles(files) {
    if (!Array.isArray(files)) {
        return [];
    }
    
    return files.map(file => ({
        file: file.path,
        ...validateReactLandmarks(file.html || file.content || '')
    }));
}

// TODO: Implement function for addressing accessibility issues from insight report
// Placeholder for the new function

/**
 * Addresses accessibility issues identified in an insight report.
 * @param {Array<Object>} issues - Array of accessibility issue objects from the insight report.
 * @param {Object} [options={}] - Optional configuration for addressing issues.
 * @param {boolean} [options.autoFix=true] - Whether to automatically apply known fixes.
 * @param {Array<string>} [options.ignore=[]] - List of issue types to ignore.
 * @returns {Object} An object containing the addressed issues, skipped issues, and a summary.
 */
function addressAccessibilityIssues(issues, options = {}) {
  const { autoFix = true, ignore = [] } = options;

  const addressed = [];
  const skipped = [];
  const summary = {
    total: issues.length,
    addressed: 0,
    skipped: 0,
    byType: {},
  };

  if (!Array.isArray(issues)) {
    throw new TypeError('issues must be an array');
  }

  for (const issue of issues) {
    if (!issue || typeof issue !== 'object' || !issue.type) {
      skipped.push({ issue, reason: 'Invalid issue format or missing type' });
      summary.skipped++;
      continue;
    }

    if (ignore.includes(issue.type)) {
      skipped.push({ issue, reason: 'Ignored by configuration' });
      summary.skipped++;
      continue;
    }

    summary.byType[issue.type] = (summary.byType[issue.type] || 0) + 1;

    let fix = null;

    if (autoFix) {
      switch (issue.type) {
        case 'missing-alt-text':
          fix = {
            action: 'add-alt-text',
            target: issue.selector || issue.element,
            value: issue.suggestedAlt || 'Image description needed',
          };
          break;
        case 'low-contrast':
          fix = {
            action: 'adjust-contrast',
            target: issue.selector || issue.element,
            value: issue.suggestedContrast || 'min-4.5:1',
          };
          break;
        case 'missing-label':
          fix = {
            action: 'add-label',
            target: issue.selector || issue.element,
            value: issue.suggestedLabel || 'Form field label',
          };
          break;
        case 'missing-lang':
          fix = {
            action: 'add-lang-attribute',
            target: 'html',
            value: issue.suggestedLang || 'en',
          };
          break;
        case 'empty-heading':
          fix = {
            action: 'add-heading-content',
            target: issue.selector || issue.element,
            value: issue.suggestedText || 'Heading',
          };
          break;
        case 'missing-button-text':
          fix = {
            action: 'add-button-text',
            target: issue.selector || issue.element,
            value: issue.suggestedText || 'Button',
          };
          break;
        case 'missing-skip-link':
          fix = {
            action: 'add-skip-link',
            target: 'body',
            value: 'Skip to main content',
          };
          break;
        case 'invalid-aria':
          fix = {
            action: 'fix-aria',
            target: issue.selector || issue.element,
            value: issue.suggestedAria || null,
          };
          break;
        case 'react-table-structure':
        case 'missing-th-scope':
          fix = {
            action: 'add-th-scope',
            target: issue.selector || issue.element,
            value: issue.scopeType || 'col',
          };
          break;
        default:
          fix = {
            action: 'manual-review',
            target: issue.selector || issue.element,
            value: issue.description || 'Manual review required',
          };
          break;
      }
    } else {
      fix = {
        action: 'manual-review',
        target: issue.selector || issue.element,
        value: issue.description || 'Manual review required',
      };
    }

    addressed.push({
      issue,
      fix,
    });
    summary.addressed++;
  }

  return { addressed, skipped, summary };
}

/**
 * Check if HTML content has table headers without scope attributes
 * @param {string} htmlContent - The HTML content to validate
 * @returns {Array<Object>} - Array of issues found
 */
function validateTableHeaders(htmlContent) {
    if (!htmlContent || typeof htmlContent !== 'string') {
        return [];
    }
    
    const issues = [];
    
    // Find all <th> tags without scope attribute
    const thWithoutScopeRegex = /<th(?![^>]*\bscope=)[^>]*>/gi;
    let match;
    
    while ((match = thWithoutScopeRegex.exec(htmlContent)) !== null) {
        issues.push({
            rule: 'REACT_027',
            type: 'react-table-structure',
            severity: 'warning',
            message: '<th> has no scope',
            suggestion: 'Add scope="col" or scope="row" so cells map to their headers',
            element: match[0],
            index: match.index,
        });
    }
    
    return issues;
}

/**
 * Apply scope attribute to table header cells
 * @param {string} htmlContent - The HTML content to modify
 * @param {Object} options - Options for applying scope
 * @param {string} options.scopeType - Either 'col' or 'row'
 * @param {string} options.selector - CSS selector for specific th elements (optional)
 * @returns {string} - Modified HTML content
 */
function applyTableHeaderScope(htmlContent, options = {}) {
    if (!htmlContent || typeof htmlContent !== 'string') {
        return htmlContent;
    }
    
    const { scopeType = 'col', selector } = options;
    
    if (selector) {
        // Apply scope only to specific th elements matching selector
        // This is a simplified approach - full implementation would need DOM parsing
        return htmlContent;
    }
    
    // Add scope attribute to <th> tags that don't have it
    return htmlContent.replace(/<th(?![^>]*\bscope=)([^>]*)>/gi, (match, attrs) => {
        return `<th scope="${scopeType}"${attrs}>`;
    });
}

// Function to ensure the element has an id
function ensureElementHasId(element) {
  if (!element.id) {
    element.id = `element-${Math.random().toString(36).substr(2, 9)}`;
  }
  return element.id;
}

// Function to add aria-label to the element
function addAriaLabel(element, labelText) {
  element.setAttribute('aria-label', labelText);
  return element;
}

// Preserve existing exports if any
module.exports = {
    hasMainLandmark,
    validateReactLandmarks,
    validateMultipleFiles,
    addressAccessibilityIssues,
    ensureElementHasId,
    addAriaLabel,
    validateTableHeaders,
    applyTableHeaderScope
};