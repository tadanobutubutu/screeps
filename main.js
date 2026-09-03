// TODO: This is the existing code that needs to be preserved
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

  findAccessibilityIssues(insightReport) {
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
          message: `Section "${section.heading}" has no content`,
          suggestedFix: 'Add meaningful content to the section'
        });
      }

      // Check for potentially inaccessible link text
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

  getLangAttribute(element) {
    if (element && element.getAttribute) {
      return element.getAttribute('lang') || document.documentElement.getAttribute('lang');
    }
    return document.documentElement ? document.documentElement.getAttribute('lang') : 'en';
  },

  personName(name) {
    if (!name) return '';
    return name.trim().charAt(0).toUpperCase() + name.trim().slice(1);
  },

  countDependencies() {
    const packageJsonPath = path.join(__dirname, 'package.json');
    const packageJson = fs.readFileSync(packageJsonPath, 'utf8');

    const dependencies = JSON.parse(packageJson).dependencies || {};
    const devDependencies = JSON.parse(packageJson).devDependencies || {};

    return {
      dependencies: Object.keys(dependencies).length,
      devDependencies: Object.keys(devDependencies).length,
      total: Object.keys(dependencies).length + Object.keys(devDependencies).length
    };
  },

  validateTableAccessibility(table) {
    if (!table) {
      return { valid: false, errors: ['Table element is required'] };
    }
    
    const errors = [];
    
    if (!table.querySelector('caption')) {
      errors.push('Table is missing a caption element');
    }
    
    if (!table.querySelector('thead')) {
      errors.push('Table is missing a thead element');
    }
    
    const rows = table.querySelectorAll('tr');
    rows.forEach((row, index) => {
      const cells = row.querySelectorAll('th, td');
      if (cells.length === 0) {
        errors.push(`Row ${index} has no cells`);
      }
    });
    
    return {
      valid: errors.length === 0,
      errors: errors
    };
  },

  validateTableStructure(table) {
    if (!table) {
      return { valid: false, error: 'Table element is required' };
    }
    
    const errors = [];
    const rows = table.querySelectorAll('tr');
    
    rows.forEach((row, rowIndex) => {
      const cells = row.querySelectorAll('td, th');
      cells.forEach((cell, cellIndex) => {
        if (!cell.hasAttribute('scope') && !cell.hasAttribute('headers')) {
          errors.push(`Cell at row ${rowIndex}, column ${cellIndex} missing scope or headers attribute`);
        }
      });
    });
    
    return {
      valid: errors.length === 0,
      errors: errors
    };
  },

  getSvgAccessibleName(svg) {
    if (!svg) return '';
    
    const ariaLabel = svg.getAttribute('aria-label');
    if (ariaLabel) return ariaLabel;
    
    const labelledBy = svg.getAttribute('aria-labelledby');
    if (labelledBy) {
      const labelElement = document.getElementById(labelledBy);
      if (labelElement) return labelElement.textContent;
    }
    
    const titleElement = svg.querySelector('title');
    if (titleElement) return titleElement.textContent;
    
    const role = svg.getAttribute('role');
    if (role === 'img') {
      const altText = svg.getAttribute('alt');
      if (altText) return altText;
    }
    
    return '';
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

  handleNewAccessibilityIssues(context) {
    const issues = [];
    
    // Handle table structure issues
    if (context && context.tables) {
      context.tables.forEach((table) => {
        const validationResult = validateTableStructure(table);
        if (!validationResult.valid) {
          issues.push({
            type: 'table-structure',
            severity: 'high',
            message: validationResult.error,
            element: table,
            suggestedFix: 'Ensure table has proper headers and semantic structure'
          });
        }
      });
    }
    
    // Handle landmark issues
    if (context && context.landmarks) {
      context.landmarks.forEach((landmark) => {
        const validationResult = validateLandmark(landmark);
        if (!validationResult.valid) {
          issues.push({
            type: 'invalid-landmark',
            severity: 'medium',
            message: validationResult.error || 'Invalid landmark structure',
            element: landmark,
            suggestedFix: 'Ensure landmark has proper role or semantic tag'
          });
        }
      });
    }
    
    // Handle SVG accessibility
    if (context && context.svgElements) {
      context.svgElements.forEach((svg) => {
        const accessibleName = getSvgAccessibleName(svg);
        if (!accessibleName) {
          issues.push({
            type: 'missing-svg-accessible-name',
            severity: 'medium',
            message: 'SVG element is missing accessible name',
            element: svg,
            suggestedFix: 'Add aria-label or title attribute to SVG'
          });
        }
      });
    }
    
    // Handle fake links
    if (context && context.fakeLinks) {
      context.fakeLinks.forEach((link) => {
        issues.push({
          type: 'fake-link',
          severity: 'high',
          message: 'Link points to invalid location',
          element: link,
          suggestedFix: 'Use proper href or button element'
        });
      });
    }
    
    // Handle color contrast issues
    if (context && context.elements) {
      context.elements.forEach((element) => {
        if (element.style && element.style.color && element.style.backgroundColor) {
          const contrastRatio = calculateContrastRatio(element.style.color, element.style.backgroundColor);
          if (contrastRatio < 4.5) {
            issues.push({
              type: 'color-contrast',
              severity: 'high',
              message: `Color contrast ratio ${contrastRatio.toFixed(2)} is below WCAG AA standard (4.5:1)`,
              element: element,
              suggestedFix: 'Increase contrast between text and background colors'
            });
          }
        }
      });
    }
    
    // Handle missing alt text on images
    if (context && context.images) {
      context.images.forEach((img) => {
        if (!img.getAttribute('alt')) {
          issues.push({
            type: 'missing-alt-text',
            severity: 'high',
            message: 'Image is missing alt attribute',
            element: img,
            suggestedFix: 'Add descriptive alt text to image'
          });
        }
      });
    }
    
    // Handle form label associations
    if (context && context.formControls) {
      context.formControls.forEach((control) => {
        const tagName = control.tagName ? control.tagName.toLowerCase() : '';
        if (tagName === 'input' || tagName === 'select' || tagName === 'textarea') {
          const hasLabel = control.getAttribute('aria-label') || 
                          control.getAttribute('aria-labelledby') ||
                          document.querySelector(`label[for="${control.id}"]`);
          if (!hasLabel) {
            issues.push({
              type: 'missing-form-label',
              severity: 'high',
              message: 'Form control is missing associated label',
              element: control,
              suggestedFix: 'Add label element with for attribute or aria-label'
            });
          }
        }
      });
    }
    
    return issues;
  }
};

function fixMainLandmarkIssues(source) {
  return AddressabilityIssues.fixMainLandmarkIssues(source);
}

function fixSemanticMarkup(source) {
  return AddressabilityIssues.fixSemanticMarkup(source);
}

function validateLandmarkStructure() {
  return AddressabilityIssues.validateLandmarkStructure();
}

function addressAccessibilityIssues(report) {
  return AddressabilityIssues.findAccessibilityIssues(report);
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    AddressabilityIssues,
    fixMainLandmarkIssues,
    fixSemanticMarkup,
    validateLandmarkStructure
  };
} else {
  // Browser environment - wait for DOM
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeAccessibility);
  } else {
    initializeAccessibility();
  }
}

function initializeAccessibility() {
  if (!document.querySelectorAll) return;
  addressAccessibilityIssues(sampleInsightReport);
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

// Additional utility functions from origin/main
function addBook(bookData) {
  // ... Existing code ...
  return bookData;
}

function createServer() {
  // ... Existing code ...
  return null;
}

function generateAccessibilityReport() {
  // Placeholder implementation
}

function calculateContrastRatio(color1, color2) {
  // Calculate relative luminance and return contrast ratio
  const getLuminance = (color) => {
    const rgb = color.match(/\d+/g);
    if (!rgb) return 0;
    const [r, g, b] = rgb.map(val => {
      const c = parseInt(val) / 255;
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  };
  
  const l1 = getLuminance(color1);
  const l2 = getLuminance(color2);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  
  return (lighter + 0.05) / (darker + 0.05);
}