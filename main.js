// main.js - Accessibility-focused implementation

// Functions to ensure the element has an id, add aria-label, render dependency graphs,
// count dependencies, and address accessibility issues from insight report
// todo-hash: 4bdb3fdb46f8c23568fe2832e296806312b7e888

functions.forEach(functionToSave => {
  window[functionToSave] = window[functionToSave] || module.exports[functionToSave];
});

// REACT_015: Add lang attribute to HTML element
function getLangAttribute(document) {
  if (!document || !document.documentElement) {
    return 'en';
  }
  return document.documentElement.getAttribute('lang') || 'en';
}

function personName(element) {
  if (!element) {
    return '';
  }
  return element.getAttribute('aria-label') || 
         element.getAttribute('name') || 
         element.textContent || 
         '';
}

// REACT_027: Fix table structure issues
function validateTableAccessibility(table) {
  if (!table) {
    return { valid: false, error: 'Table element is required' };
  }

  const errors = [];
  const hasCaption = table.querySelector('caption');
  const hasHeaders = table.querySelector('th');

  if (!hasCaption) {
    errors.push('Table should have a caption element');
  }

  if (!hasHeaders) {
    errors.push('Table should have header cells (th)');
  }

  const cells = table.querySelectorAll('td, th');
  cells.forEach((cell, index) => {
    if (!cell.hasAttribute('scope') && !cell.hasAttribute('headers')) {
      const isHeader = cell.tagName.toLowerCase() === 'th';
      if (!isHeader) {
        errors.push(`Cell at index ${index} should have scope or headers attribute`);
      }
    }
  });

  return {
    valid: errors.length === 0,
    errors: errors
  };
}

function validateTableStructure(table) {
  if (!table) {
    return { valid: false, error: 'Table element is required' };
  }

  const errors = [];
  const rows = table.querySelectorAll('tr');
  
  if (rows.length === 0) {
    errors.push('Table must have at least one row');
    return { valid: false, errors };
  }

  // Check for proper thead/tbody structure
  const thead = table.querySelector('thead');
  const tbody = table.querySelector('tbody');
  const tfoot = table.querySelector('tfoot');

  // Validate row structure
  rows.forEach((row, rowIndex) => {
    const cells = row.querySelectorAll('td, th');
    if (cells.length === 0) {
      errors.push(`Row ${rowIndex} has no cells`);
    }
  });

  // Check for colspan/rowspan validity
  const cells = table.querySelectorAll('td, th');
  cells.forEach((cell, index) => {
    const colspan = parseInt(cell.getAttribute('colspan') || '1', 10);
    const rowspan = parseInt(cell.getAttribute('rowspan') || '1', 10);
    
    if (colspan < 1) {
      errors.push(`Cell ${index} has invalid colspan`);
    }
    if (rowspan < 1) {
      errors.push(`Cell ${index} has invalid rowspan`);
    }
  });

  return {
    valid: errors.length === 0,
    errors: errors,
    rowCount: rows.length
  };
}

// REACT_017: Add/fix landmark issues
function validateLandmarkStructure(container) {
  if (!container) {
    return { valid: false, error: 'Container element is required' };
  }

  const errors = [];
  const warnings = [];

  // Count landmark elements
  const mainElements = container.querySelectorAll('main, [role="main"]');
  const headerElements = container.querySelectorAll('header, [role="banner"]');
  const footerElements = container.querySelectorAll('footer, [role="contentinfo"]');
  const navElements = container.querySelectorAll('nav, [role="navigation"]');

  // Each page should have exactly one main landmark
  if (mainElements.length === 0) {
    errors.push('Page should have exactly one main landmark');
  } else if (mainElements.length > 1) {
    errors.push(`Page has ${mainElements.length} main landmarks (should have exactly 1)`);
  }

  // Header and footer should appear only once each
  if (headerElements.length > 1) {
    warnings.push(`Page has ${headerElements.length} header/banner landmarks`);
  }
  if (footerElements.length > 1) {
    warnings.push(`Page has ${footerElements.length} footer/contentinfo landmarks`);
  }

  // Check for landmark hierarchy issues
  const landmarks = container.querySelectorAll('[role="banner"], [role="navigation"], [role="main"], [role="contentinfo"], [role="complementary"]');
  landmarks.forEach((landmark, index) => {
    const parent = landmark.parentElement;
    if (parent) {
      const parentRole = parent.getAttribute('role');
      if (parentRole === 'banner' || parentRole === 'contentinfo') {
        errors.push(`Landmark ${index} has improper parent landmark`);
      }
    }
  });

  return {
    valid: errors.length === 0,
    errors: errors,
    warnings: warnings,
    counts: {
      main: mainElements.length,
      header: headerElements.length,
      footer: footerElements.length,
      navigation: navElements.length
    }
  };
}

// REACT_041: Add accessible names to SVGs
function getSvgAccessibleName(svgElement) {
  if (!svgElement) {
    return '';
  }

  // Check for aria-label
  const ariaLabel = svgElement.getAttribute('aria-label');
  if (ariaLabel) {
    return ariaLabel;
  }

  // Check for aria-labelledby referencing an existing element
  const ariaLabelledby = svgElement.getAttribute('aria-labelledby');
  if (ariaLabelledby) {
    const referencedElement = document.getElementById(ariaLabelledby);
    if (referencedElement) {
      return referencedElement.textContent || '';
    }
  }

  // Check for title element inside SVG
  const title = svgElement.querySelector('title');
  if (title) {
    return title.textContent || '';
  }

  // Check for desc element inside SVG
  const desc = svgElement.querySelector('desc');
  if (desc) {
    return desc.textContent || '';
  }

  return '';
}

module.exports = {
  // ... Existing functions

  countDependencies() {
    return require.main.requires.length;
  },

  // Additional functions to address accessibility issues from insight report
  addressAccessibilityIssues(insightReport) {
    // Implement function to address the reported accessibility issues
  },

  generateAccessibilityReport(accessibilityReport) {
    if (!accessibilityReport || !Array.isArray(accessibilityReport.issues)) {
      return [];
    }

    const report = accessibilityReport.issues.map(issue => ({
      issueType: issue.type,
      status: issue.status || 'pending',
      fixApplied: issue.fixApplied || ''
    }));

    return report;
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
      const points = scorePoints[issue.type] || scorePoints['other'];
      return score + points;
    }, 0);
  },

  ensureUniqueLandmarksFromString(source) {
    const mainBlockRegex = /<main[^>]*>.*?<\/main>/gs;

    const matches = Array.from(source.matchAll(mainBlockRegex));
    if (matches.length <= 1) {
      return source;
    }

    let result = source;
    for (let i = 1; i < matches.length; i++) {
      const block = matches[i][0];
      const fixedBlock = block
        .replace(/<main([^>]*)>/, '<section$1>')
        .replace(/<\/main>/, '</section>');
      result = result.replace(block, fixedBlock);
    }

    return result;
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

    if (!landmarkRole) {
      if (implicitLandmarks[tagName]) {
        landmarkRole = implicitLandmarks[tagName];
      } else {
        return { valid: false, error: 'No landmark role found' };
      }
    }

    if (!landmarkRoles.includes(landmarkRole)) {
      return { valid: false, error: `Invalid landmark role: ${landmarkRole}` };
    }

    return { valid: true, role: landmarkRole };
  },

  // REACT_015: Functions for lang attribute
  getLangAttribute,
  personName,

  // REACT_027: Functions for table accessibility and structure
  validateTableAccessibility,
  validateTableStructure,

  // REACT_017: Function for landmark structure validation
  validateLandmarkStructure,

  // REACT_041: Function for SVG accessible name
  getSvgAccessibleName,

  // Application configuration
  config: {
    port: process.env.PORT || 3000,
    env: process.env.NODE_ENV || 'development'
  },

  // Application entry points
  createServer() {
    // ... (existing code)
  },

  startApp() {
    // ... (existing code)
  }
};

// Utility for spawning a command
function spawnSomeCommand(callback) {
    const child_process = require('child_process');
    const child = child_process.spawn('someCommand', [], {
        stdio: 'inherit',
    });
    child.on('exit', (code, signal) => {
        if (code === 0) {
            callback(null, 'Successfully executed someCommand');
        } else {
            callback(new Error(`someCommand failed with code ${code}`));
        }
    });
}